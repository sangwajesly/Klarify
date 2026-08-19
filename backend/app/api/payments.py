import os
from uuid import uuid4
from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Header, Depends
from pydantic import BaseModel
from supabase import create_client, Client

from app.services.payment_provider import provider
from app.core.auth import get_current_user

router = APIRouter()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client | None = None
if url and key:
    supabase = create_client(url, key)


class CreatePaymentRequest(BaseModel):
    institution_id: str
    amount: float
    currency: Optional[str] = "XAF"
    description: Optional[str] = None


@router.post("/create-intent")
async def create_payment_intent(payload: CreatePaymentRequest, current_user: dict = Depends(get_current_user)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured.")

    # Secure Auth Check: Verify that user is a member of this institution
    user_id = current_user.get("sub") or current_user.get("id")
    try:
        member_check = supabase.table("institution_members").select("role").eq("user_id", user_id).eq("institution_id", payload.institution_id).execute()
        if not member_check.data:
            raise HTTPException(status_code=403, detail="Access denied. You are not a member of this institution.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify membership: {str(e)}")

    # Extract and clean user email to avoid invalid email format issues
    user_email = current_user.get("email") or "sangwajesly82@gmail.com"
    if "@phone.klarify.app" in user_email or "@" not in user_email:
        user_email = "sangwajesly82@gmail.com"

    # create a provider payment intent/session
    result = provider.create_payment_intent(
        institution_id=payload.institution_id,
        amount=payload.amount,
        currency=payload.currency,
        metadata={
            "description": payload.description or "Klarify IPES Subscription Upgrade",
            "email": user_email.strip(),
        },
    )

    # persist a payment record with client-side UUID to prevent RLS SELECT issues
    payment_id = str(uuid4())
    record = {
        "id": payment_id,
        "institution_id": payload.institution_id,
        "amount": float(payload.amount),
        "currency": payload.currency or "XAF",
        "provider": "FAPSHI",
        "provider_reference": result.get("provider_reference"),
        "status": "PENDING",
        "metadata": {"description": payload.description, "raw": result.get("raw", {})},
    }

    try:
        supabase.table("partner_payments").insert(record).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database write failed: {str(e)}")

    return {
        "checkout_url": result.get("checkout_url"),
        "provider_reference": result.get("provider_reference"),
        "payment_id": payment_id,
    }


class CreateDirectPaymentRequest(BaseModel):
    institution_id: str
    amount: float
    phone: str
    name: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None


@router.post("/create-direct-pay")
async def create_direct_payment(payload: CreateDirectPaymentRequest, current_user: dict = Depends(get_current_user)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured.")

    # Secure Auth Check: Verify that user is a member of this institution
    user_id = current_user.get("sub") or current_user.get("id")
    try:
        member_check = supabase.table("institution_members").select("role").eq("user_id", user_id).eq("institution_id", payload.institution_id).execute()
        if not member_check.data:
            raise HTTPException(status_code=403, detail="Access denied. You are not a member of this institution.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify membership: {str(e)}")

    # Clean the phone number client-side/server-side validation
    clean_phone = "".join(filter(str.isdigit, payload.phone))
    if clean_phone.startswith("237") and len(clean_phone) > 9:
        clean_phone = clean_phone[3:]
    
    import re
    if not re.match(r"^6[0-9]{8}$", clean_phone):
        raise HTTPException(status_code=400, detail="Please enter a valid 9-digit Cameroonian MTN MoMo or Orange Money phone number starting with 6.")

    try:
        result = provider.create_direct_payment(
            institution_id=payload.institution_id,
            amount=payload.amount,
            phone=clean_phone,
            name=payload.name or "Klarify Partner",
            email=payload.email or "admin@klarifypath.com",
            description=payload.description,
        )
    except Exception as err:
        raise HTTPException(status_code=400, detail=f"Fapshi direct payment failed: {str(err)}")

    # persist a payment record with client-side UUID to prevent RLS SELECT issues
    payment_id = str(uuid4())
    record = {
        "id": payment_id,
        "institution_id": payload.institution_id,
        "amount": float(payload.amount),
        "currency": "XAF",
        "provider": "FAPSHI",
        "provider_reference": result.get("provider_reference"),
        "status": "PENDING",
        "metadata": {"description": payload.description, "raw": result.get("raw", {})},
    }

    try:
        supabase.table("partner_payments").insert(record).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database write failed: {str(e)}")

    return {
        "success": True,
        "provider_reference": result.get("provider_reference"),
        "payment_id": payment_id,
    }


@router.get("/status/{trans_id}")
async def get_payment_status(trans_id: str):
    try:
        res = provider.check_status(trans_id)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def payments_webhook(request: Request, x_provider_signature: Optional[str] = Header(None)):
    """Generic webhook receiver to update `partner_payments`.

    The provider adapter attempts to verify the signature. The webhook payload
    should include a reference that maps back to `partner_payments.provider_reference`.
    """
    body = await request.body()
    event = provider.verify_webhook(body, x_provider_signature)

    # Attempt to find the partner payment by provider_reference
    provider_ref = event.get("provider_reference") or event.get("data", {}).get("reference")
    status = event.get("status") or event.get("event") or event.get("type")

    if not provider_ref:
        return {"ok": False, "reason": "missing provider_reference"}

    # Normalize Fapshi status mapping
    mapped_status = "PENDING"
    if str(status).upper() == "SUCCESSFUL":
        mapped_status = "COMPLETED"
    elif str(status).upper() in ("FAILED", "EXPIRED"):
        mapped_status = "FAILED"

    update_payload = {
        "status": mapped_status,
        "metadata": event,
    }

    try:
        resp = supabase.table("partner_payments").update(update_payload).eq("provider_reference", provider_ref).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database update failed: {str(e)}")

    # If completed, update the institution subscription_tier
    if mapped_status == "COMPLETED" and len(resp.data) > 0:
        payment_record = resp.data[0]
        inst_id = payment_record.get("institution_id")
        amount = float(payment_record.get("amount", 0))
        
        new_tier = "PRO"
        if amount >= 350000:
            new_tier = "FEATURED"
        
        try:
            supabase.table("institutions").update({"subscription_tier": new_tier}).eq("id", inst_id).execute()
        except Exception as e:
            # Log error but don't fail webhook response completely
            print(f"Failed to update institution subscription tier: {e}")

    return {"ok": True}

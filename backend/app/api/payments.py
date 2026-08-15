import os
from uuid import uuid4
from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel
from supabase import create_client, Client

from app.services.payment_provider import provider

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
async def create_payment_intent(payload: CreatePaymentRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured.")

    # create a provider payment intent/session
    result = provider.create_payment_intent(
        institution_id=payload.institution_id,
        amount=payload.amount,
        currency=payload.currency,
        metadata={"description": payload.description} if payload.description else {},
    )

    # persist a payment record
    record = {
        "institution_id": payload.institution_id,
        "amount": float(payload.amount),
        "currency": payload.currency or "XAF",
        "provider": os.getenv("PAYMENT_PROVIDER_NAME", "unknown"),
        "provider_reference": result.get("provider_reference"),
        "status": "PENDING",
        "metadata": result.get("raw", {}),
    }

    resp = supabase.table("partner_payments").insert(record).execute()
    if resp.error:
        raise HTTPException(status_code=500, detail=str(resp.error))

    db_row = resp.data[0]

    return {
        "checkout_url": result.get("checkout_url"),
        "provider_reference": result.get("provider_reference"),
        "payment_id": db_row.get("id"),
    }


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

    # Normalize status mapping - provider-specific mapping should be added
    mapped_status = "COMPLETED" if str(status).lower() in ("paid", "completed", "payment.succeeded") else "FAILED"

    update_payload = {
        "status": mapped_status,
        "provider_reference": provider_ref,
        "metadata": event,
    }

    resp = supabase.table("partner_payments").update(update_payload).eq("provider_reference", provider_ref).execute()
    if resp.error:
        raise HTTPException(status_code=500, detail=str(resp.error))

    # Optionally, upon successful payment you may want to flip institution verification
    # or trigger other business workflows. Keep that out of the webhook by default
    # and surface a small event via `metadata` so admins can act.

    return {"ok": True}

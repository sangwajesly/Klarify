import os
import random
import string
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# ── Supabase client (uses anon key for OTP table operations) ──────────────────
_url = os.getenv("SUPABASE_URL")
_key = os.getenv("SUPABASE_KEY")
_supabase: Client | None = create_client(_url, _key) if _url and _key else None

# ── Africa's Talking SMS client ───────────────────────────────────────────────
_at_sms = None

def _get_at_sms():
    global _at_sms
    if _at_sms is not None:
        return _at_sms
    try:
        import africastalking
        username = os.getenv("AT_USERNAME", "sandbox")
        api_key = os.getenv("AT_API_KEY", "")
        if not api_key:
            raise RuntimeError("AT_API_KEY not set")
        africastalking.initialize(username, api_key)
        _at_sms = africastalking.SMS
    except Exception as e:
        print(f"[OTP] Africa's Talking init failed: {e}")
        _at_sms = None
    return _at_sms


def _dev_mode_enabled() -> bool:
    return os.getenv("DEV_MODE", "false").strip().lower() in {"1", "true", "yes", "y"}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _normalize_phone(phone: str) -> str:
    """Ensure phone has E.164 format, defaulting Cameroon +237."""
    phone = phone.strip().replace(" ", "").replace("-", "")
    if not phone.startswith("+"):
        # If 9 digits assume Cameroon local number
        phone = "+237" + phone.lstrip("0")
    return phone


def _phone_to_email(phone: str) -> str:
    """Convert a phone number to a synthetic email for Supabase auth."""
    digits = phone.replace("+", "").replace(" ", "")
    return f"{digits}@phone.klarify.app"


def _generate_code(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


# ── Public API ────────────────────────────────────────────────────────────────

def send_otp(phone: str, full_name: str) -> dict:
    """
    Generate a 6-digit OTP, store it in otp_codes, then send it via
    Africa's Talking SMS. Returns the phone (normalized).
    """
    if not _supabase:
        raise HTTPException(status_code=500, detail="Database not configured.")

    phone = _normalize_phone(phone)
    code  = _generate_code()
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=5)).isoformat()

    # Invalidate any previous unused codes for this phone
    _supabase.table("otp_codes") \
        .update({"used": True}) \
        .eq("phone", phone) \
        .eq("used", False) \
        .execute()

    # Insert new OTP row
    _supabase.table("otp_codes").insert({
        "phone":      phone,
        "code":       code,
        "name":       full_name,
        "expires_at": expires_at,
        "used":       False,
        "attempts":   0,
    }).execute()

    # Send SMS
    sms = _get_at_sms()
    if sms:
        try:
            msg = f"Your Klarify verification code is: {code}\nExpires in 5 minutes. Do not share it."
            response = sms.send(msg, [phone])
            print(f"[OTP] SMS send response for {phone}: {response}")
            if isinstance(response, dict) and response.get("SMSMessageData", {}).get("Recipients"):
                recipient = response["SMSMessageData"]["Recipients"][0]
                if recipient.get("statusCode") != "Success":
                    raise RuntimeError(
                        f"SMS send failed for {phone}: {recipient.get('status') or recipient.get('statusCode') or 'unknown'}"
                    )
                print(f"[OTP] SMS successfully queued for {phone}")
            else:
                print(f"[OTP] Unexpected SMS response: {response}")
        except Exception as e:
            print(f"[OTP] SMS send failed: {e}")
            if _dev_mode_enabled():
                print(f"[OTP] DEV — fallback code for {phone}: {code}")
            else:
                raise HTTPException(
                    status_code=500,
                    detail="Unable to send OTP via SMS. Please try again later."
                )
    else:
        if _dev_mode_enabled():
            print(f"[OTP] DEV — code for {phone}: {code}")
        else:
            raise HTTPException(
                status_code=500,
                detail="SMS service is not configured. Please contact support."
            )

    return {"phone": phone, "message": "OTP sent successfully."}


def verify_otp(phone: str, code: str) -> dict:
    """
    Verify the OTP code for a phone number.
    Returns {'valid': True} or raises HTTPException.
    """
    if not _supabase:
        raise HTTPException(status_code=500, detail="Database not configured.")

    phone = _normalize_phone(phone)
    now   = datetime.now(timezone.utc).isoformat()

    result = _supabase.table("otp_codes") \
        .select("*") \
        .eq("phone", phone) \
        .eq("used", False) \
        .gte("expires_at", now) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired or not found. Please request a new code."
        )

    row = result.data[0]

    # Rate-limit attempts
    if row["attempts"] >= 3:
        _supabase.table("otp_codes").update({"used": True}).eq("id", row["id"]).execute()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many incorrect attempts. Please request a new code."
        )

    if row["code"] != code.strip():
        _supabase.table("otp_codes") \
            .update({"attempts": row["attempts"] + 1}) \
            .eq("id", row["id"]) \
            .execute()
        remaining = 3 - row["attempts"] - 1
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incorrect code. {remaining} attempt(s) remaining."
        )

    # Mark used
    _supabase.table("otp_codes").update({"used": True}).eq("id", row["id"]).execute()

    return {"valid": True, "phone": phone, "name": row.get("name", "")}

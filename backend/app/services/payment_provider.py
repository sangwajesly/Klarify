import os
import json
import uuid
from typing import Any, Dict, Optional
from app.services import fapshi

class PaymentProvider:
    """Adapter for the Fapshi payment SDK."""

    def __init__(self) -> None:
        self.frontend_url = os.getenv(
            "FRONTEND_URL", "https://www.klarifypath.com"
        )

    def create_payment_intent(self, institution_id: str, amount: float, currency: str = "XAF", metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create a payment intent / checkout session via Fapshi."""
        metadata = metadata or {}
        
        # We need a unique external ID
        external_id = f"PAY-{uuid.uuid4().hex[:12].upper()}"

        payment_data = {
            'amount': int(amount), 
            'email': metadata.get('email', 'sangwajesly82@gmail.com'),
            'externalId': external_id,
            'userId': str(institution_id),
            'redirectUrl': f"{self.frontend_url}/partner/dashboard?payment=success",
            'message': metadata.get('description', 'Klarify IPES Subscription'),
        }

        resp = fapshi.initiate_pay(payment_data)

        if resp.get('statusCode') == 200:
            return {
                "provider_reference": resp.get("transId"),
                "checkout_url": resp.get("link"),
                "raw": resp,
            }
        else:
            raise Exception(f"Fapshi error: {resp.get('message', 'Unknown error')}")

    def create_direct_payment(self, institution_id: str, amount: float, phone: str, name: str, email: str, description: Optional[str] = None) -> Dict[str, Any]:
        """Collect phone number and trigger push PIN prompt on user's phone directly."""
        # 1. Clean and validate phone number (Must start with 6 and have 9 digits)
        clean_phone = "".join(filter(str.isdigit, phone))
        if clean_phone.startswith("237") and len(clean_phone) > 9:
            clean_phone = clean_phone[3:]
        
        # We need a unique external ID
        external_id = f"PAY-{uuid.uuid4().hex[:12].upper()}"

        payment_data = {
            'amount': int(amount),
            'phone': clean_phone,
            'name': name or 'Klarify Partner',
            'email': email or 'admin@klarifypath.com',
            'externalId': external_id,
            'userId': str(institution_id),
            'message': description or 'Klarify IPES Subscription Upgrade',
        }

        resp = fapshi.direct_pay(payment_data)

        if resp.get('statusCode') == 200:
            return {
                "provider_reference": resp.get("transId"),
                "raw": resp,
            }
        else:
            raise Exception(resp.get('message', 'Unknown error'))

    def check_status(self, trans_id: str) -> Dict[str, Any]:
        """Fetch latest payment status from Fapshi."""
        return fapshi.payment_status(trans_id)

    def verify_webhook(self, body_bytes: bytes, signature_header: Optional[str]) -> Dict[str, Any]:
        """
        Verify webhook by calling Fapshi to confirm the transaction status.
        """
        parsed = json.loads(body_bytes.decode("utf-8") or "{}")
        trans_id = parsed.get("transId")

        if not trans_id:
            parsed["_unverified"] = True
            parsed["_verification_error"] = "No transId in webhook payload"
            return parsed

        # Call Fapshi to get the real status
        event = fapshi.payment_status(trans_id)
        
        if event.get("statusCode") == 200:
            # We got valid details from fapshi
            event["_unverified"] = False
            # Ensure provider_reference matches so payments.py can find it
            event["provider_reference"] = trans_id
            return event
        else:
            parsed["_unverified"] = True
            parsed["_verification_error"] = event.get("message", "Failed to fetch from Fapshi")
            return parsed

# module-level instance for easy reuse
provider = PaymentProvider()

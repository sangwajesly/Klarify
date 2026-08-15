import os
import hmac
import hashlib
import json
import uuid
import importlib
from typing import Any, Dict, Optional

PROVIDER_API_KEY = os.getenv("PAYMENT_PROVIDER_API_KEY", "")
PROVIDER_API_BASE = os.getenv("PAYMENT_PROVIDER_API_BASE", "https://api.payment-provider.example")
PROVIDER_WEBHOOK_SECRET = os.getenv("PAYMENT_PROVIDER_WEBHOOK_SECRET", "")


class PaymentProvider:
    """Adapter for a payment SDK or HTTP provider.

    The implementation attempts to import a vendor SDK if available. If an
    SDK module is found it will be used; otherwise the adapter falls back to
    a placeholder implementation so the rest of the system can be developed
    without provider keys.
    """

    def __init__(self) -> None:
        self.api_key = PROVIDER_API_KEY
        self.base = PROVIDER_API_BASE
        self.webhook_secret = PROVIDER_WEBHOOK_SECRET
        self.client = None

        # try to auto-detect a Python SDK module commonly named by vendors
        for candidate in ("payment_sdk", "paymentsdk", "vendor_sdk", "mpesa_sdk", "momo_sdk"):
            try:
                mod = importlib.import_module(candidate)
                # vendor client creation pattern varies; we attempt common shapes
                if hasattr(mod, "Client"):
                    self.client = mod.Client(api_key=self.api_key)
                elif hasattr(mod, "ClientSDK"):
                    self.client = mod.ClientSDK(self.api_key)
                else:
                    self.client = mod
                break
            except Exception:
                continue

    def create_payment_intent(self, institution_id: str, amount: float, currency: str = "XAF", metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create a payment intent / checkout session.

        If a vendor SDK was detected we call a best-effort method on it; if not,
        we return a synthetic placeholder object.
        """
        metadata = metadata or {}

        if self.client:
            # Best-effort plumbing: many SDKs expose a `create_payment` or
            # `create_checkout_session` method. Update this block to match the
            # vendor SDK's exact API after unpacking the SDK.
            try:
                if hasattr(self.client, "create_checkout_session"):
                    session = self.client.create_checkout_session(amount=amount, currency=currency, metadata=metadata)
                    return {
                        "provider_reference": getattr(session, "id", None) or session.get("id"),
                        "checkout_url": getattr(session, "url", None) or session.get("url"),
                        "raw": session,
                    }
                if hasattr(self.client, "create_payment"):
                    session = self.client.create_payment(amount=amount, currency=currency, metadata=metadata)
                    return {
                        "provider_reference": getattr(session, "reference", None) or session.get("reference"),
                        "checkout_url": getattr(session, "checkout_url", None) or session.get("checkout_url"),
                        "raw": session,
                    }
            except Exception:
                # fall back to placeholder below
                pass

        # Placeholder synthetic session
        provider_ref = f"tmp_{uuid.uuid4().hex}"
        checkout_url = f"https://checkout.example/{provider_ref}"

        return {
            "provider_reference": provider_ref,
            "checkout_url": checkout_url,
            "raw": {"note": "placeholder - replace with vendor SDK when available"},
        }

    def verify_webhook(self, body_bytes: bytes, signature_header: Optional[str]) -> Dict[str, Any]:
        """Verify webhook signature (best-effort) and return parsed event.

        If a webhook secret is configured the adapter performs an HMAC-SHA256
        verification. If an SDK provides specialized verification routines they
        should be used by replacing this logic.
        """
        parsed = json.loads(body_bytes.decode("utf-8") or "{}")

        # If an SDK provides a verification helper, prefer it
        if self.client and hasattr(self.client, "verify_webhook_signature"):
            try:
                verified = self.client.verify_webhook_signature(body_bytes, signature_header, secret=self.webhook_secret)
                parsed["_unverified"] = not bool(verified)
                return parsed
            except Exception as e:
                parsed["_unverified"] = True
                parsed["_verification_error"] = str(e)
                return parsed

        if not self.webhook_secret:
            parsed["_unverified"] = True
            return parsed

        try:
            if not signature_header:
                raise ValueError("missing signature header")

            expected = hmac.new(self.webhook_secret.encode("utf-8"), body_bytes, hashlib.sha256).hexdigest()
            sig = signature_header.split("=")[-1]
            if not hmac.compare_digest(expected, sig):
                raise ValueError("invalid signature")

            parsed["_unverified"] = False
            return parsed
        except Exception as e:
            parsed["_unverified"] = True
            parsed["_verification_error"] = str(e)
            return parsed


# module-level instance for easy reuse
provider = PaymentProvider()

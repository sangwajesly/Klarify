import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer(auto_error=False)


def _is_dev_mode() -> bool:
    """
    Strictly check for local development mode.
    Only returns True if ENVIRONMENT is explicitly set to 'development'
    or DEV_MODE is 'true'. No fallback to PORT detection — Vercel does
    not set PORT but IS production.
    """
    return (
        os.getenv("ENVIRONMENT", "").lower() == "development"
        or os.getenv("DEV_MODE", "").lower() == "true"
    )


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Decodes and verifies the Supabase Auth JWT token.
    Returns the user data dict.
    """
    supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET")

    if not credentials:
        if _is_dev_mode():
            return {"id": "dev-guest-id", "email": "guest@klarify.com", "role": "anon"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    if not supabase_jwt_secret:
        if _is_dev_mode():
            return {"id": "dev-user-id", "email": "dev@klarify.com", "role": "authenticated"}
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_SECRET environment variable is not configured. "
                   "Please set it in your Vercel environment variables."
        )

    try:
        payload = jwt.decode(token, supabase_jwt_secret, algorithms=["HS256"], audience="authenticated")
        return payload
    except JWTError as e:
        if _is_dev_mode():
            print(f"DEV MODE WARNING: JWT decode failed ({e}). Proceeding with mock user.")
            return {"id": "dev-user-id", "email": "dev@klarify.com", "role": "authenticated"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

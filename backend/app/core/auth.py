import os
import urllib.request
import json
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, jwk

security = HTTPBearer(auto_error=False)

# Simple in-memory cache for JWKS keys to avoid requesting it every time
_jwks_cache = {}

def _is_dev_mode() -> bool:
    """
    Strictly check for local development mode.
    Only returns True if ENVIRONMENT is explicitly set to 'development'
    or DEV_MODE is 'true'.
    """
    return (
        os.getenv("ENVIRONMENT", "").lower() == "development"
        or os.getenv("DEV_MODE", "").lower() == "true"
    )

def _get_jwk_key(kid: str, supabase_url: str):
    """
    Retrieves and caches a public key from the Supabase JWKS endpoint matching the given Key ID (kid).
    """
    global _jwks_cache
    if kid in _jwks_cache:
        return _jwks_cache[kid]
    
    if not supabase_url:
        return None
        
    try:
        # Build JWKS url from SUPABASE_URL
        jwks_url = f"{supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
        
        # Perform HTTP GET request using standard library urllib
        req = urllib.request.Request(jwks_url, headers={"User-Agent": "Klarify-Backend"})
        with urllib.request.urlopen(req, timeout=5) as response:
            jwks_data = json.loads(response.read().decode("utf-8"))
            
        for key_dict in jwks_data.get("keys", []):
            cached_key = jwk.construct(key_dict)
            _jwks_cache[key_dict["kid"]] = cached_key
            
        return _jwks_cache.get(kid)
    except Exception as e:
        print(f"Error fetching JWKS from Supabase: {e}")
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Decodes and verifies the Supabase Auth JWT token (supports both HS256 and ES256).
    Returns the user data dict.
    """
    supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    supabase_url = os.getenv("SUPABASE_URL")

    if not credentials:
        if _is_dev_mode():
            return {"id": "dev-guest-id", "email": "guest@klarify.com", "role": "anon"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # 1. Get the unverified header to determine the algorithm
    try:
        header = jwt.get_unverified_header(token)
        alg = header.get("alg")
        kid = header.get("kid")
    except Exception as e:
        if _is_dev_mode():
            return {"id": "dev-user-id", "email": "dev@klarify.com", "role": "authenticated"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Malformed authentication token header: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Decode based on algorithm
    try:
        if alg == "ES256":
            # Asymmetric Elliptic Curve verification
            if not kid:
                raise JWTError("Key ID (kid) missing in token header for ES256 algorithm.")
            
            key = _get_jwk_key(kid, supabase_url)
            if not key:
                raise JWTError(f"Could not retrieve public key for kid: {kid}")
                
            payload = jwt.decode(token, key, algorithms=["ES256"], audience="authenticated")
            return payload
            
        elif alg == "HS256":
            # Symmetric HS256 verification (fallback/legacy/local-testing)
            if not supabase_jwt_secret:
                if _is_dev_mode():
                    return {"id": "dev-user-id", "email": "dev@klarify.com", "role": "authenticated"}
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="SUPABASE_JWT_SECRET environment variable is not configured."
                )
            payload = jwt.decode(token, supabase_jwt_secret, algorithms=["HS256"], audience="authenticated")
            return payload
            
        else:
            raise JWTError(f"Unsupported algorithm: {alg}")
            
    except JWTError as e:
        if _is_dev_mode():
            print(f"DEV MODE WARNING: JWT decode failed ({e}). Proceeding with mock user.")
            return {"id": "dev-user-id", "email": "dev@klarify.com", "role": "authenticated"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {str(e)}. Token header: {header}",
            headers={"WWW-Authenticate": "Bearer"},
        )



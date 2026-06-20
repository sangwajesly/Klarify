import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer(auto_error=False)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Decodes and verifies the Supabase Auth JWT token.
    Returns the user data dict.
    """
    supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    
    if not credentials:
        # Check if in local development to allow a default guest/dev user
        is_dev = os.getenv("ENVIRONMENT") == "development" or os.getenv("DEV_MODE") == "true" or not os.getenv("PORT")
        if is_dev:
            return {"id": "dev-guest-id", "email": "guest@klarify.com", "role": "anon"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = credentials.credentials
    if not supabase_jwt_secret:
        is_dev = os.getenv("ENVIRONMENT") == "development" or os.getenv("DEV_MODE") == "true" or not os.getenv("PORT")
        if is_dev:
            # Return mock user for dev ease of use
            return {"id": "dev-user-id", "email": "dev@klarify.com", "role": "authenticated"}
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_SECRET environment variable is not configured."
        )
        
    try:
        # Supabase JWTs are signed with HS256 using the project's JWT secret
        payload = jwt.decode(token, supabase_jwt_secret, algorithms=["HS256"], audience="authenticated")
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

import os
from fastapi import APIRouter, Query, HTTPException, Depends
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
from app.models.request_models import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import get_recommendations
from app.core.auth import get_current_user
from app.core.otp_service import send_otp, verify_otp
from app.api.payments import router as payments_router

load_dotenv()

router = APIRouter()

# Include payments subrouter
router.include_router(payments_router, prefix="/payments", tags=["payments"]) 

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client | None = None
if url and key:
    supabase = create_client(url, key)


# ── Request / Response Models ─────────────────────────────────────────────────

class SendOTPRequest(BaseModel):
    phone: str
    full_name: str

class VerifyOTPRequest(BaseModel):
    phone: str
    code: str


# ── Recommendation ────────────────────────────────────────────────────────────

@router.post("/recommend/al-student", response_model=RecommendationResponse)
async def recommend_programs(
    request: RecommendationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Get academic program recommendations based on A/L subjects and interests."""
    return get_recommendations(request)


# ── GCE Results ───────────────────────────────────────────────────────────────

@router.get("/gce/search")
async def search_gce_results(
    name: str = Query(..., min_length=3, description="The name of the candidate or center number to search for"),
    exam_year: int | None = Query(None, description="Optional filter for exam year"),
    exam_type: str | None = Query(None, description="Optional filter for exam type (GEN_A, GEN_O, TVE_A, TVE_O)")
):
    """Search for GCE Results by Candidate Name or Center Number."""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured.")
        
    try:
        clean_name  = " ".join(name.strip().split())
        search_term = f"%{clean_name.upper()}%"
        
        # Smart search: match against name or center number
        query = supabase.table("gce_results").select("*").or_(
            f"candidate_name.ilike.{search_term},center_number.ilike.{search_term}"
        )
        
        if exam_year:
            query = query.eq("exam_year", exam_year)
            
        if exam_type:
            query = query.eq("exam_type", exam_type)
            
        response = query.limit(50).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── OTP Auth ──────────────────────────────────────────────────────────────────

@router.post("/auth/send-otp")
async def send_otp_endpoint(payload: SendOTPRequest):
    """
    Generate and send a 6-digit OTP to the given phone number via SMS.
    Called when a user signs up or logs in with a phone number.
    """
    result = send_otp(phone=payload.phone, full_name=payload.full_name)
    return result


@router.post("/auth/verify-otp")
async def verify_otp_endpoint(payload: VerifyOTPRequest):
    """
    Verify the OTP entered by the user.
    On success, the frontend uses this confirmation to proceed with
    Supabase signUp (phone users) or signIn (returning users).
    """
    result = verify_otp(phone=payload.phone, code=payload.code)
    return result

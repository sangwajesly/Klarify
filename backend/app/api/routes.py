import os
from fastapi import APIRouter, Query, HTTPException, Depends
from supabase import create_client, Client
from dotenv import load_dotenv
from app.models.request_models import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import get_recommendations
from app.core.auth import get_current_user

load_dotenv()

router = APIRouter()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client | None = None
if url and key:
    supabase = create_client(url, key)

@router.post("/recommend/al-student", response_model=RecommendationResponse)
async def recommend_programs(
    request: RecommendationRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Get academic program recommendations based on A/L subjects and interests.
    """
    return get_recommendations(request)

@router.get("/gce/search")
async def search_gce_results(
    name: str = Query(..., min_length=3, description="The name of the candidate to search for"),
    exam_year: int | None = Query(None, description="Optional filter for exam year")
):
    """
    Search for GCE Results by Candidate Name.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured.")
        
    try:
        # Strip trailing/leading spaces and replace double spaces with single to be safe
        clean_name = " ".join(name.strip().split())
        search_term = f"%{clean_name.upper()}%"
        
        query = supabase.table("gce_results").select("*").ilike("candidate_name", search_term)
        
        if exam_year:
            query = query.eq("exam_year", exam_year)
            
        response = query.limit(50).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

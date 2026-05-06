from fastapi import APIRouter
from app.models.request_models import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import get_recommendations

router = APIRouter()

@router.post("/recommend/al-student", response_model=RecommendationResponse)
async def recommend_programs(request: RecommendationRequest):
    """
    Get academic program recommendations based on A/L subjects and interests.
    """
    return get_recommendations(request)

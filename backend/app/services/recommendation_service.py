from app.models.request_models import RecommendationRequest, RecommendationResponse, ProgramResponse, ExamDetails
from app.data_loader.loader import data_store
from app.core.recommender import ml_recommender
from app.utils.text_processing import prepare_program_text, prepare_user_text

def get_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    user_subjects = set(s.lower() for s in request.subjects)
    
    # 1. Rule-Based Filtering
    # Filter programs where required_al_subjects is a subset of user_subjects
    filtered_programs = []
    for program in data_store.programs:
        prog_reqs = set(req.lower() for req in program.get("required_al_subjects", []))
        if prog_reqs.issubset(user_subjects) or not prog_reqs:
            filtered_programs.append(program)
            
    # If no programs match strict subset logic, fallback to partial matching or all programs 
    # (for a better UX in demo if user selects too few subjects)
    if not filtered_programs:
        filtered_programs = data_store.programs

    # 2. Prepare text for ML
    programs_text = [prepare_program_text(p) for p in filtered_programs]
    user_text = prepare_user_text(request.subjects, request.interest)
    
    # Ensure recommender is fitted on current corpus
    # In a real app with static data, this would be done once at startup.
    if not ml_recommender.is_fitted:
        all_programs_text = [prepare_program_text(p) for p in data_store.programs]
        ml_recommender.fit(all_programs_text)
        
    # 3. Calculate Similarity
    similarities = ml_recommender.calculate_similarities(user_text, programs_text)
    
    # 4. Rank and Format Results
    scored_programs = list(zip(filtered_programs, similarities))
    # Sort by similarity descending
    scored_programs.sort(key=lambda x: x[1], reverse=True)
    
    # Take top 10
    top_results = scored_programs[:10]
    
    response_programs = []
    for prog, score in top_results:
        # Attach concours data if required
        exam_details = None
        if prog.get("requiresConcours") and "concours_id" in prog:
            conc_data = data_store.concours_map.get(prog["concours_id"])
            if conc_data:
                exam_details = ExamDetails(
                    name=conc_data["name"],
                    month=conc_data["month"],
                    deadline=conc_data["deadline"],
                    fee=conc_data["fee"]
                )
                
        response_programs.append(
            ProgramResponse(
                id=prog["id"],
                name=prog["name"],
                university=prog["university"],
                duration=prog["duration"],
                requiresConcours=prog.get("requiresConcours", False),
                portalUrl=prog.get("portalUrl", "#"),
                examDetails=exam_details,
                score=round(score, 2)
            )
        )
        
    # 5. Return full response
    return RecommendationResponse(
        programs=response_programs,
        certifications=data_store.certifications,
        books=data_store.books
    )

from app.models.request_models import RecommendationRequest, RecommendationResponse, ProgramResponse, ExamDetails
from app.data_loader.loader import data_store
from app.core.recommender import ml_recommender
from app.utils.text_processing import prepare_program_text, prepare_user_text

def get_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    user_subjects = set(s.lower() for s in request.subjects)
    user_interest_text = " ".join(request.interest).lower()
    
    # 1. Base Filtering (Eligibility)
    # We still want to prioritize programs where the student meets minimum requirements
    # but the instructions suggest a more nuanced "Eligibility Depth".
    # For now, let's include all programs but score them based on depth.
    all_programs = data_store.programs
    
    # 2. Prepare text for ML (Signal 1)
    programs_text = [prepare_program_text(p) for p in all_programs]
    user_text = prepare_user_text(request.subjects, request.interest)
    
    if not ml_recommender.is_fitted:
        ml_recommender.fit(programs_text)
        
    semantic_scores = ml_recommender.calculate_similarities(user_text, programs_text)
    
    scored_programs = []
    for i, program in enumerate(all_programs):
        # --- Signal 1: Semantic Match (55%) ---
        semantic_score = semantic_scores[i]
        
        # --- Signal 2: Subject Overlap Score (30%) ---
        req_val = program.get("required_al_subjects")
        if not req_val:
            prog_reqs = set()
        elif isinstance(req_val, str):
            prog_reqs = set(s.strip().lower() for s in req_val.split(",") if s.strip())
        elif isinstance(req_val, list):
            prog_reqs = set(str(s).strip().lower() for s in req_val if s)
        else:
            prog_reqs = set()

        if not prog_reqs:
            overlap_score = 1.0  # Open programs match perfectly by subject
        else:
            matching_subjects = user_subjects.intersection(prog_reqs)
            overlap_score = len(matching_subjects) / len(prog_reqs)
            
        # --- Signal 3: Career Alignment Score (15%) ---
        careers_raw = program.get("Careers") or program.get("careers") or []
        career_list = [c.lower() for c in careers_raw]
        career_score = 0.0
        if career_list:
            interest_words = set(user_interest_text.split())
            matched_careers = 0
            for career in career_list:
                career_words = set(career.split())
                # If any significant word in the career title matches user interest
                if any(word in interest_words for word in career_words if len(word) > 2):
                    matched_careers += 1
            
            if len(career_list) > 0:
                career_score = matched_careers / len(career_list)

        # --- FINAL SCORE CALCULATION ---
        final_score = (
            0.55 * semantic_score +
            0.30 * overlap_score +
            0.15 * career_score
        )
        
        scored_programs.append({
            "program": program,
            "final_score": final_score,
            "faculty": program.get("faculty", "Unknown")
        })

    # 4. Rank by final score
    scored_programs.sort(key=lambda x: x["final_score"], reverse=True)
    
    # --- Signal 4: Diversity Boost (Post-ranking) ---
    # Limits results to a maximum of 2 programs per faculty in top results
    final_top_results = []
    faculty_counts = {}
    
    for item in scored_programs:
        faculty = item["faculty"]
        count = faculty_counts.get(faculty, 0)
        
        if count < 2:
            final_top_results.append(item)
            faculty_counts[faculty] = count + 1
            
        if len(final_top_results) >= 10:
            break

    # Format Results
    response_programs = []
    for item in final_top_results:
        prog = item["program"]
        score = item["final_score"]
        
        # Check concours
        requires_conc = prog.get("requiresConcour") == "true" or prog.get("requiresConcours") is True
        exam_details = None
        if requires_conc and prog.get("concours_id"):
            conc_data = data_store.concours_map.get(prog["concours_id"])
            if conc_data:
                exam_details = ExamDetails(
                    name=conc_data["name"],
                    month=conc_data["month"],
                    deadline=conc_data["deadline"],
                    fee=str(conc_data["fee"])
                )
                
        # Resolve duration
        duration_val = prog.get("duration")
        if not duration_val and "durations" in prog:
            durations = prog.get("durations")
            if durations is not None:
                duration_val = f"{durations} Years"
        if not duration_val:
            duration_val = "3 Years"

        response_programs.append(
            ProgramResponse(
                id=prog["id"],
                name=prog["name"],
                university=prog["university"],
                duration=duration_val,
                requiresConcours=requires_conc,
                portalUrl=prog.get("portalUrl", "#"),
                examDetails=exam_details,
                score=round(score, 2)
            )
        )
        
    return RecommendationResponse(
        programs=response_programs,
        certifications=data_store.certifications,
        books=data_store.books
    )

from app.models.request_models import RecommendationRequest, RecommendationResponse, ProgramResponse, ExamDetails
import os
from supabase import create_client
from app.data_loader.loader import data_store
from app.core.recommender import ml_recommender
from app.utils.text_processing import prepare_program_text, prepare_user_text


def fetch_programs_from_db():
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    if not url or not key:
        return None
    try:
        supabase = create_client(url, key)
        # Fetch programs and include linked institution verification status so
        # we can expose programs that are either approved OR whose institution
        # has been verified.
        resp = supabase.table('programs').select('*, institutions(verification_status)').execute()
        data = getattr(resp, 'data', None)
        if data and isinstance(data, list) and len(data) > 0:
            # Normalize keys to match existing program dict shape used elsewhere
            normalized = []
            for p in data:
                # Determine visibility at service level: program is eligible if
                # `is_approved` is True OR it's associated with an institution
                # whose `verification_status` == 'VERIFIED'. The public RLS
                # mirrors this logic, but because the service key bypasses RLS
                # we must apply the same rule here for consistency.
                inst = p.get('institutions') or {}
                inst_verified = (inst.get('verification_status') == 'VERIFIED') if isinstance(inst, dict) else False
                if not p.get('is_approved') and not inst_verified:
                    # Skip unapproved programs that belong to unverified institutions
                    continue

                normalized.append({
                    'id': p.get('id'),
                    'name': p.get('name'),
                    'university': p.get('university'),
                    'faculty': p.get('faculty'),
                    'durations': p.get('durations') or p.get('duration'),
                    'requiresConcour': p.get('requires_concour') or p.get('requiresConcour'),
                    'concours_id': p.get('concours_id'),
                    'portalUrl': p.get('portal_url') or p.get('portalUrl'),
                    'required_al_subjects': p.get('required_al_subjects'),
                    'tags': p.get('tags') or [],
                    'careers': p.get('careers') or p.get('Careers') or [],
                    'Careers': p.get('Careers') or p.get('careers') or [],
                        'descriptions': p.get('descriptions') or p.get('description'),
                        'degree_obtained': p.get('degree_obtained') or p.get('degreeObtained') or p.get('degree'),
                        'tuition_fee_xaf': p.get('tuition_fee_xaf') or p.get('tuition_fee') or p.get('tuition_fee_xaf')
                })
            return normalized
    except Exception:
        return None
    return None

def get_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    user_subjects = set(s.lower() for s in request.subjects)
    user_interest_text = " ".join(request.interest).lower()
    
    # 1. Base Filtering (Eligibility)
    # Prefer live DB programs (Supabase) if available; otherwise fall back to local JSON
    db_programs = fetch_programs_from_db()
    all_programs = db_programs if db_programs is not None else data_store.programs
    
    # 2. Prepare text for ML (Signal 1)
    user_text = prepare_user_text(request.subjects, request.interest)
    
    programs_text = [prepare_program_text(p) for p in all_programs]
    # Re-fit if not yet fitted or corpus size changed
    try:
        existing_count = ml_recommender.program_vectors.shape[0] if ml_recommender.program_vectors is not None else 0
    except Exception:
        existing_count = 0

    if (not ml_recommender.is_fitted) or (existing_count != len(programs_text)):
        ml_recommender.fit(programs_text)
        
    semantic_scores = ml_recommender.calculate_similarities(user_text)
    
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
                # Extended exam details are optional: older concours.json may not include them.
                exam_details = ExamDetails(
                    name=conc_data.get("name"),
                    month=conc_data.get("month"),
                    # Keep old "deadline" for the existing UI.
                    deadline=conc_data.get("deadline") or conc_data.get("reg_date"),
                    fee=str(conc_data.get("fee")) if conc_data.get("fee") is not None else None,

                    required_subjects=conc_data.get("required_al_subjects"),
                    required_documents=conc_data.get("required_documents"),
                    summary=conc_data.get("brief_summary"),
                    reg_date=conc_data.get("reg_date"),
                    writing_date=conc_data.get("writing_date"),
                    registration_procedure=conc_data.get("registration_procedure"),
                    portalUrl=conc_data.get("portalUrl"),
                    notes=conc_data.get("notes"),
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
                faculty=prog.get("faculty") or "Unknown",
                duration=duration_val,
                requiresConcours=requires_conc,
                portalUrl=prog.get("portalUrl") or "#",
                descriptions=prog.get("descriptions") or prog.get("description"),
                degree_obtained=prog.get("degree_obtained"),
                tuition_fee_xaf=(float(prog.get("tuition_fee_xaf")) if prog.get("tuition_fee_xaf") is not None else None),
                examDetails=exam_details,
                score=round(score, 2),
                careers=prog.get("Careers") or prog.get("careers") or []
            )
        )
        
    return RecommendationResponse(
        programs=response_programs,
        certifications=data_store.certifications,
        books=data_store.books
    )

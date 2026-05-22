def normalize_text(text: str) -> str:
    """Normalize text by converting to lowercase and stripping whitespace."""
    if not text:
        return ""
    return text.lower().strip()

def prepare_program_text(program: dict) -> str:
    """Combine tags, careers, and description for vectorization."""
    tags = " ".join(program.get("tags") or [])
    careers_list = program.get("Careers") or program.get("careers") or []
    careers = " ".join(careers_list)
    description = program.get("descriptions") or program.get("description") or ""
    combined = f"{tags} {careers} {description}"
    return normalize_text(combined)

def prepare_user_text(subjects: list, interests: list) -> str:
    """Combine user subjects and interests for vectorization."""
    subjects_str = " ".join(subjects)
    interests_str = " ".join(interests)
    combined = f"{subjects_str} {interests_str}"
    return normalize_text(combined)

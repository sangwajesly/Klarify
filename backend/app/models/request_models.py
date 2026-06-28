from pydantic import BaseModel, Field
from typing import List, Optional

class RecommendationRequest(BaseModel):
    subjects: List[str]
    interest: List[str]

class ExamDetails(BaseModel):
    # Existing fields (keep for backward compatibility)
    name: str
    month: Optional[str] = None
    deadline: Optional[str] = None
    fee: Optional[str] = None

    # Extended fields (may be missing in older data)
    required_subjects: Optional[List[str]] = None
    required_documents: Optional[List[str]] = None
    summary: Optional[str] = None
    reg_date: Optional[str] = None
    writing_date: Optional[str] = None
    registration_procedure: Optional[List[str]] = None
    portalUrl: Optional[str] = None
    notes: Optional[str] = None


class ProgramResponse(BaseModel):
    id: str
    name: str
    university: str
    faculty: str
    duration: str
    requiresConcours: bool
    portalUrl: str
    examDetails: Optional[ExamDetails] = None
    score: float
    careers: List[str]

class CertificationResponse(BaseModel):
    id: int
    title: str
    provider: str
    url: str

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    url: str

class RecommendationResponse(BaseModel):
    programs: List[ProgramResponse]
    certifications: List[CertificationResponse]
    books: List[BookResponse]

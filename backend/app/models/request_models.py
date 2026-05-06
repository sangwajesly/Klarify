from pydantic import BaseModel, Field
from typing import List, Optional

class RecommendationRequest(BaseModel):
    subjects: List[str]
    interest: List[str]

class ExamDetails(BaseModel):
    name: str
    month: str
    deadline: str
    fee: str

class ProgramResponse(BaseModel):
    id: str
    name: str
    university: str
    duration: str
    requiresConcours: bool
    portalUrl: str
    examDetails: Optional[ExamDetails] = None
    score: float

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

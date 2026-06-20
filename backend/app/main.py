from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.data_loader.loader import data_store
from app.core.recommender import ml_recommender
from app.utils.text_processing import prepare_program_text

app = FastAPI(
    title="Klarify Academic Recommendation API",
    description="AI-powered academic recommendations using TF-IDF and Cosine Similarity.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://www.klarifypath.com",
        "https://klarifypath.com",
        "https://klarify-path-be.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    # Fit the ML model once at startup for performance
    all_programs_text = [prepare_program_text(p) for p in data_store.programs]
    ml_recommender.fit(all_programs_text)
    print("Startup complete: Data loaded and Recommender model fitted.")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Klarify Backend API",
        "docs": "/docs",
        "health": "/health"
    }

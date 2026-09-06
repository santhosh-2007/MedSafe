import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database.session import Base, engine
from backend.app.api.auth import router as auth_router
from backend.app.api.patients import router as patients_router
from backend.app.api.risks import router as risks_router
from backend.app.api.audit import router as audit_router
from backend.app.api.evaluation import router as evaluation_router
from backend.app.api.feedback import router as feedback_router
from backend.app.api.privacy import router as privacy_router

# Initialize tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MEDSAFE API",
    description="Medication Safety & Clinical Decision Support Research Prototype",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(patients_router)
app.include_router(risks_router)
app.include_router(audit_router)
app.include_router(evaluation_router)
app.include_router(feedback_router)
app.include_router(privacy_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "system": "MEDSAFE Clinical Decision Support API",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "synthetic_data": True
    }

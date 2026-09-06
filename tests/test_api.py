import os
import sys
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app
from backend.app.database.session import Base, engine, SessionLocal
from backend.app.models.domain import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if not db.query(User).filter(User.username == "doctortest").first():
        user = User(
            username="doctortest",
            hashed_password=pwd_context.hash("pass123"),
            role="DOCTOR",
            full_name="Dr. Test"
        )
        db.add(user)
        db.commit()
    db.close()

def test_login_success():
    response = client.post("/api/auth/login", json={"username": "doctortest", "password": "pass123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "DOCTOR"

def test_login_invalid():
    response = client.post("/api/auth/login", json={"username": "doctortest", "password": "wrongpassword"})
    assert response.status_code == 401

def test_consent_and_patient_access():
    login_res = client.post("/api/auth/login", json={"username": "doctortest", "password": "pass123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Consent
    consent_res = client.post("/api/auth/consent", json={"disclaimer_accepted": True}, headers=headers)
    assert consent_res.status_code == 200

    # Patients List
    patients_res = client.get("/api/patients", headers=headers)
    assert patients_res.status_code == 200
    assert isinstance(patients_res.json(), list)

def test_health_check():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"

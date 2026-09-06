from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.domain import User, Consent, AuditLog
from backend.app.schemas.domain import LoginRequest, TokenResponse, UserResponse, ConsentRequest
from backend.app.auth.security import verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    token = create_access_token({"sub": user.username, "role": user.role})

    # Log audit
    audit = AuditLog(
        username=user.username,
        role=user.role,
        action="LOGIN",
        patient_id="",
        details=f"User {user.username} logged into demo environment."
    )
    db.add(audit)
    db.commit()

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        username=user.username,
        role=user.role,
        full_name=user.full_name
    )

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    audit = AuditLog(
        username=current_user.username,
        role=current_user.role,
        action="LOGOUT",
        patient_id="",
        details="User logged out."
    )
    db.add(audit)
    db.commit()
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/consent")
def record_consent(req: ConsentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not req.disclaimer_accepted:
        raise HTTPException(status_code=400, detail="Consent must be accepted to access system.")

    consent = Consent(
        username=current_user.username,
        notice_version="v1.0",
        disclaimer_accepted=True
    )
    db.add(consent)

    audit = AuditLog(
        username=current_user.username,
        role=current_user.role,
        action="CONSENT_ACCEPTED",
        patient_id="",
        details="Clinical decision support notice and safety disclaimer accepted."
    )
    db.add(audit)
    db.commit()
    return {"status": "SUCCESS", "message": "Consent recorded"}

from auth.jwt import create_access_token
from auth.password import verify_password
from crud.login_attempt import (is_login_locked, record_failed_login,
                                reset_login_attempt)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from models.user import User
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["Users"])


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login_user(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    phone = form_data.username
    ip_address = request.client.host if request.client else "unknown"

    if is_login_locked(db, phone, ip_address):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Try again later.",
        )

    user = db.query(User).filter(User.phone == phone).first()

    if user is None or not verify_password(
        form_data.password,
        user.password_hash,
    ):
        record_failed_login(
            db,
            phone,
            ip_address,
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    reset_login_attempt(
        db,
        phone,
        ip_address,
    )

    access_token = create_access_token(
        {"user_id": user.id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
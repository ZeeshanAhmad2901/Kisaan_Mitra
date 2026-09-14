from auth.jwt import create_access_token
from auth.password import verify_password
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException
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
    phone: str,
    password: str,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.phone == phone).first()

    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid phone number or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive",
        )

    access_token = create_access_token({"user_id": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
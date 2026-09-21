from auth.dependencies import get_current_user
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


@router.get("/me")
def get_me(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "phone": user.phone,
        "email": user.email,
        "role": user.role,
        "mandi_id": user.mandi_id,
        "is_active": user.is_active,
    }
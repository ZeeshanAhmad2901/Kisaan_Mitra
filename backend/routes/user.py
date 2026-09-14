from crud.user import create_user
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.user import UserCreate, UserResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["Users"])


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=UserResponse)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    allowed_public_roles = {"farmer", "driver"}

    if user.role not in allowed_public_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Public registration is only allowed for farmer and driver roles",
        )

    return create_user(db, user)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from crud.user import create_user
from database.connection import engine
from schemas.user import UserCreate, UserResponse


router = APIRouter(prefix="/users", tags=["Users"])


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)
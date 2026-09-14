from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from crud.mandi import create_mandi
from database.connection import engine
from schemas.mandi import MandiCreate, MandiResponse


router = APIRouter(prefix="/mandis", tags=["Mandis"])


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=MandiResponse)
def register_mandi(mandi: MandiCreate, db: Session = Depends(get_db)):
    return create_mandi(db, mandi)
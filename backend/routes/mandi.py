from auth.roles import require_role
from crud.mandi import create_mandi
from database.connection import engine
from fastapi import APIRouter, Depends
from schemas.mandi import MandiCreate, MandiResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/mandis", tags=["Mandis"])


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=MandiResponse)
def register_mandi(
    mandi: MandiCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    return create_mandi(db, mandi)
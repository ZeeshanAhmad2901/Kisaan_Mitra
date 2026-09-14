from auth.dependencies import get_current_user
from auth.roles import require_role
from crud.mandi import create_mandi, get_all_mandis
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

@router.get("/", response_model=list[MandiResponse])
def list_mandis(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_all_mandis(db)
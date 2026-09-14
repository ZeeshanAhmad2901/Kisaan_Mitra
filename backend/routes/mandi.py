from auth.dependencies import get_current_user
from auth.roles import require_role
from crud.mandi import (create_mandi, deactivate_mandi, get_all_mandis,
                        get_mandi_by_id, update_mandi)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException
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
    return create_mandi(
    db,
    mandi,
    current_user["user_id"],
)

@router.get("/", response_model=list[MandiResponse])
def list_mandis(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_all_mandis(db)

@router.put("/{mandi_id}", response_model=MandiResponse)
def edit_mandi(
    mandi_id: int,
    mandi: MandiCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    updated_mandi = update_mandi(
    db,
    mandi_id,
    mandi,
    current_user["user_id"],
)

    if updated_mandi is None:
        raise HTTPException(status_code=404, detail="Mandi not found")

    return updated_mandi


@router.delete("/{mandi_id}")
def delete_mandi(
    mandi_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    deleted_mandi = deactivate_mandi(
    db,
    mandi_id,
    current_user["user_id"],
)

    if deleted_mandi is None:
        raise HTTPException(status_code=404, detail="Mandi not found")

    return {"message": "Mandi deactivated successfully"}
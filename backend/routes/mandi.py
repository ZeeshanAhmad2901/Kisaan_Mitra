from math import ceil

from auth.dependencies import get_current_user
from auth.roles import require_role
from crud.mandi import (create_mandi, deactivate_mandi, get_all_mandis,
                        get_mandi_by_id, update_mandi)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException
from schemas.mandi import MandiCreate, MandiListResponse, MandiResponse
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

from math import ceil


@router.get("/", response_model=MandiListResponse)
def list_mandis(
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page must be greater than or equal to 1",
        )

    if page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=400,
            detail="Page size must be between 1 and 100",
        )

    mandis, total = get_all_mandis(
        db,
        page=page,
        page_size=page_size,
        search=search,
    )

    pages = ceil(total / page_size) if total else 0

    return {
        "items": mandis,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
    }

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
        raise HTTPException(
            status_code=404,
            detail="Mandi not found",
        )

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
        raise HTTPException(
            status_code=404,
            detail="Mandi not found",
        )

    return {"message": "Mandi deactivated successfully"}
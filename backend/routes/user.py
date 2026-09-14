from math import ceil

from auth.roles import require_role
from crud.user import (create_user, deactivate_user, get_all_users,
                       get_user_by_id, update_user)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.user import UserCreate, UserListResponse, UserResponse, UserUpdate
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

    try:
        return create_user(db, user)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

@router.get("/", response_model=UserListResponse)
def list_users(
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("admin")),
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

    users, total = get_all_users(
        db,
        page=page,
        page_size=page_size,
        search=search,
    )

    pages = ceil(total / page_size) if total else 0

    return {
        "items": users,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
    }

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("admin")),
):
    user = get_user_by_id(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.put("/{user_id}", response_model=UserResponse)
def edit_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("admin")),
):
    user = update_user(db, user_id, user_data)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("admin")),
):
    user = deactivate_user(db, user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {"message": "User deactivated successfully"}
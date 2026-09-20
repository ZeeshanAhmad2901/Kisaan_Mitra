from auth.roles import require_role
from crud.system_setting import (get_or_create_system_settings,
                                 update_system_settings)
from database.connection import engine
from fastapi import APIRouter, Depends
from models.user import User
from schemas.system_setting import SystemSettingResponse, SystemSettingUpdate
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/system-settings",
    tags=["System Settings"],
)


def get_db():
    db = Session(engine)

    try:
        yield db
    finally:
        db.close()


@router.get(
    "/",
    response_model=SystemSettingResponse,
)
def get_settings(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("superAdmin")
    ),
):
    return get_or_create_system_settings(db)


@router.put(
    "/",
    response_model=SystemSettingResponse,
)
def update_settings(
    settings_data: SystemSettingUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("superAdmin")
    ),
):
    actor = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    return update_system_settings(
        db,
        settings_data,
        actor_id=current_user["user_id"],
        actor_name=actor.name if actor else None,
        actor_role=current_user["role"],
    )
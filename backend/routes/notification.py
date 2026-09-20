from math import ceil

from auth.dependencies import get_current_user
from crud.notification import (get_user_notifications,
                               mark_all_notifications_read,
                               mark_notification_read)
from database.connection import engine
from fastapi import APIRouter, Depends, Query
from schemas.notification import NotificationListResponse, NotificationResponse
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=NotificationListResponse)
def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    unread_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    items, total, unread_count, pages = get_user_notifications(
        db,
        user_id=current_user["user_id"],
        page=page,
        page_size=page_size,
        unread_only=unread_only,
    )

    return NotificationListResponse(
        items=items,
        total=total,
        unread_count=unread_count,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.put("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    updated = mark_all_notifications_read(
        db,
        user_id=current_user["user_id"],
    )

    db.commit()

    return {
        "message": "All notifications marked as read",
        "updated": updated,
    }
    
@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    notification = mark_notification_read(
        db,
        notification_id=notification_id,
        user_id=current_user["user_id"],
    )

    if not notification:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Notification not found",
        )

    db.commit()
    db.refresh(notification)

    return notification

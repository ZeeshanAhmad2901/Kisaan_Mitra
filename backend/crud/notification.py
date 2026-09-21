from math import ceil

from models.notification import Notification
from sqlalchemy.orm import Session


def create_notification(
    db: Session,
    *,
    user_id: int,
    title: str,
    message: str,
    notification_type: str,
    entity_type: str | None = None,
    entity_id: str | None = None,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
        entity_type=entity_type,
        entity_id=entity_id,
        is_read=False,
    )

    db.add(notification)
    db.flush()

    return notification


def list_notifications(
    db: Session,
    user_id: int,
    page: int = 1,
    page_size: int = 20,
):
    page = max(1, page)
    page_size = max(1, min(page_size, 100))

    query = (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
    )

    total = query.count()

    notifications = (
        query
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    total_pages = ceil(total / page_size) if total else 0

    return {
        "items": notifications,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


def get_user_notifications(
    db: Session,
    *,
    user_id: int,
    page: int = 1,
    page_size: int = 20,
    unread_only: bool = False,
):
    page = max(1, page)
    page_size = max(1, min(page_size, 100))

    query = db.query(Notification).filter(
        Notification.user_id == user_id
    )

    if unread_only:
        query = query.filter(
            Notification.is_read.is_(False)
        )

    total = query.count()

    unread_count = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .count()
    )

    items = (
        query
        .order_by(Notification.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    pages = ceil(total / page_size) if total else 0

    return items, total, unread_count, pages

def mark_notification_read(
    db: Session,
    notification_id: int,
    user_id: int,
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == user_id,
        )
        .first()
    )

    if notification is None:
        return None

    notification.is_read = True
    db.commit()
    db.refresh(notification)

    return notification


def mark_all_notifications_read(
    db: Session,
    user_id: int,
):
    updated = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read.is_(False),
        )
        .update(
            {"is_read": True},
            synchronize_session=False,
        )
    )

    db.commit()

    return updated

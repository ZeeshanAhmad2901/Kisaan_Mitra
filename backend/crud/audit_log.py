from datetime import datetime

from models.audit_log import AuditLog
from sqlalchemy.orm import Session


def create_audit_log(
    db: Session,
    *,
    actor_id: int | None,
    actor_name: str | None,
    actor_role: str | None,
    action: str,
    entity_type: str,
    entity_id: str | None,
    description: str,
    details: dict | None = None,
) -> AuditLog:
    audit_log = AuditLog(
        actor_id=actor_id,
        actor_name=actor_name,
        actor_role=actor_role,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        description=description,
        details=details,
        created_at=datetime.utcnow(),
    )

    db.add(audit_log)
    db.flush()

    return audit_log


def get_audit_logs(
    db: Session,
    *,
    page: int = 1,
    page_size: int = 20,
    action: str | None = None,
    actor_role: str | None = None,
    entity_type: str | None = None,
) -> tuple[list[AuditLog], int]:
    query = db.query(AuditLog)

    if action:
        query = query.filter(AuditLog.action == action)

    if actor_role:
        query = query.filter(AuditLog.actor_role == actor_role)

    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)

    total = query.count()

    logs = (
        query.order_by(AuditLog.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return logs, total
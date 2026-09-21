import math

from auth.dependencies import get_current_user
from auth.roles import require_role
from crud.audit_log import get_audit_logs
from database.connection import engine
from fastapi import APIRouter, Depends, Query
from schemas.audit_log import AuditLogListResponse
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"],
)


def get_db():
    db = Session(engine)

    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=AuditLogListResponse)
def list_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    action: str | None = Query(None),
    actor_role: str | None = Query(None),
    entity_type: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("superAdmin")
    ),
):
    logs, total = get_audit_logs(
        db,
        page=page,
        page_size=page_size,
        action=action,
        actor_role=actor_role,
        entity_type=entity_type,
    )

    return AuditLogListResponse(
        items=logs,
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total else 0,
    )
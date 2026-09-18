from datetime import date

from auth.roles import require_role
from crud.slot import create_slot, deactivate_slot, get_slot_by_id, get_slots
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.slot import SlotCreate, SlotResponse
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/slots",
    tags=["Slots"],
)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


def serialize_slot(slot, db: Session) -> dict:
    return {
        "id": slot.id,
        "mandi_id": slot.mandi_id,
        "mandi_name": slot.mandi.name if hasattr(slot, "mandi") else db.query(
            __import__("models.mandi", fromlist=["Mandi"]).Mandi
        ).filter_by(id=slot.mandi_id).first().name,
        "slot_date": slot.slot_date,
        "start_time": slot.start_time,
        "end_time": slot.end_time,
        "total_slots": slot.total_slots,
        "booked_slots": slot.booked_slots,
        "is_active": slot.is_active,
        "is_available": slot.booked_slots < slot.total_slots,
        "created_at": slot.created_at,
    }


@router.get(
    "/",
    response_model=list[SlotResponse],
)
def list_slots(
    mandi_id: int | None = None,
    slot_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("farmer", "mandiOwner", "superAdmin")),
):
    slots = get_slots(
        db,
        mandi_id=mandi_id,
        slot_date=slot_date,
    )

    return [serialize_slot(slot, db) for slot in slots]


@router.get(
    "/{slot_id}",
    response_model=SlotResponse,
)
def get_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("farmer", "mandiOwner", "superAdmin")
    ),
):
    slot = get_slot_by_id(db, slot_id)

    if slot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    return serialize_slot(slot, db)


@router.post(
    "/",
    response_model=SlotResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_slot(
    slot_data: SlotCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    try:
        slot = create_slot(
            db,
            slot_data,
            current_user["user_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return serialize_slot(slot, db)


@router.delete(
    "/{slot_id}",
)
def delete_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    slot = deactivate_slot(
        db,
        slot_id,
        current_user["user_id"],
    )

    if slot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )

    return {"message": "Slot deactivated successfully"}

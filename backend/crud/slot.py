from models.mandi import Mandi
from models.slot import Slot
from schemas.slot import SlotCreate
from sqlalchemy.orm import Session


def create_slot(
    db: Session,
    slot_data: SlotCreate,
    owner_id: int,
) -> Slot:
    if slot_data.start_time >= slot_data.end_time:
        raise ValueError("Slot start time must be earlier than end time")

    mandi = (
        db.query(Mandi)
        .filter(
            Mandi.id == slot_data.mandi_id,
            Mandi.owner_id == owner_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if mandi is None:
        raise ValueError("Mandi not found or does not belong to this owner")

    existing_slot = (
        db.query(Slot)
        .filter(
            Slot.mandi_id == slot_data.mandi_id,
            Slot.slot_date == slot_data.slot_date,
            Slot.start_time == slot_data.start_time,
            Slot.end_time == slot_data.end_time,
            Slot.is_active.is_(True),
        )
        .first()
    )

    if existing_slot is not None:
        raise ValueError("A slot with the same date and time already exists")

    slot = Slot(
        mandi_id=slot_data.mandi_id,
        slot_date=slot_data.slot_date,
        start_time=slot_data.start_time,
        end_time=slot_data.end_time,
        total_slots=slot_data.total_slots,
        booked_slots=0,
        is_active=True,
    )

    db.add(slot)
    db.commit()
    db.refresh(slot)

    return slot


def get_slots(
    db: Session,
    mandi_id: int | None = None,
    slot_date=None,
) -> list[Slot]:
    query = (
        db.query(Slot)
        .filter(Slot.is_active.is_(True))
    )

    if mandi_id is not None:
        query = query.filter(Slot.mandi_id == mandi_id)

    if slot_date is not None:
        query = query.filter(Slot.slot_date == slot_date)

    return (
        query
        .order_by(
            Slot.slot_date.asc(),
            Slot.start_time.asc(),
            Slot.id.asc(),
        )
        .all()
    )


def get_slot_by_id(
    db: Session,
    slot_id: int,
) -> Slot | None:
    return (
        db.query(Slot)
        .filter(
            Slot.id == slot_id,
            Slot.is_active.is_(True),
        )
        .first()
    )


def deactivate_slot(
    db: Session,
    slot_id: int,
    owner_id: int,
) -> Slot | None:
    slot = (
        db.query(Slot)
        .join(Mandi, Mandi.id == Slot.mandi_id)
        .filter(
            Slot.id == slot_id,
            Slot.is_active.is_(True),
            Mandi.owner_id == owner_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if slot is None:
        return None

    slot.is_active = False

    db.commit()
    db.refresh(slot)

    return slot

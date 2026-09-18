from sqlalchemy.orm import Session

from models.booking import Booking
from models.mandi import Mandi
from models.procurement import Procurement
from models.user import User
from schemas.procurement import ProcurementCreate, ProcurementUpdate


def _get_owner_booking(
    db: Session,
    booking_id: int,
    owner_id: int,
) -> Booking:
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if booking is None:
        raise ValueError("Booking not found")

    mandi = (
        db.query(Mandi)
        .filter(
            Mandi.id == booking.mandi_id,
            Mandi.owner_id == owner_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if mandi is None:
        raise ValueError("Booking does not belong to this mandi owner")

    return booking


def create_procurement(
    db: Session,
    procurement_data: ProcurementCreate,
    owner_id: int,
) -> Procurement:
    booking = _get_owner_booking(
        db,
        procurement_data.booking_id,
        owner_id,
    )

    if booking.status not in {"in_progress", "completed"}:
        raise ValueError(
            "Procurement can only be recorded for an active or completed booking"
        )

    existing = (
        db.query(Procurement)
        .filter(Procurement.booking_id == booking.id)
        .first()
    )

    if existing is not None:
        raise ValueError("Procurement already exists for this booking")

    farmer = (
        db.query(User)
        .filter(
            User.id == booking.farmer_id,
            User.role == "farmer",
        )
        .first()
    )

    if farmer is None:
        raise ValueError("Farmer not found")

    if procurement_data.weighed_quantity > booking.quantity:
        raise ValueError(
            "Weighed quantity cannot exceed booked quantity"
        )

    procurement = Procurement(
        booking_id=booking.id,
        farmer_id=booking.farmer_id,
        mandi_id=booking.mandi_id,
        crop_type=booking.crop_type,
        booked_quantity=booking.quantity,
        weighed_quantity=procurement_data.weighed_quantity,
        quality_grade=procurement_data.quality_grade,
        procurement_amount=procurement_data.procurement_amount,
        procurement_status="completed",
        payment_status="pending",
    )

    db.add(procurement)
    db.commit()
    db.refresh(procurement)

    return procurement


def get_procurement(
    db: Session,
    procurement_id: int,
) -> Procurement | None:
    return (
        db.query(Procurement)
        .filter(Procurement.id == procurement_id)
        .first()
    )


def get_booking_procurement(
    db: Session,
    booking_id: int,
) -> Procurement | None:
    return (
        db.query(Procurement)
        .filter(Procurement.booking_id == booking_id)
        .first()
    )


def get_farmer_procurements(
    db: Session,
    farmer_id: int,
):
    return (
        db.query(Procurement)
        .filter(Procurement.farmer_id == farmer_id)
        .order_by(
            Procurement.created_at.desc(),
            Procurement.id.desc(),
        )
        .all()
    )


def get_mandi_procurements(
    db: Session,
    mandi_id: int,
):
    return (
        db.query(Procurement)
        .filter(Procurement.mandi_id == mandi_id)
        .order_by(
            Procurement.created_at.desc(),
            Procurement.id.desc(),
        )
        .all()
    )


def update_procurement(
    db: Session,
    procurement_id: int,
    procurement_data: ProcurementUpdate,
    owner_id: int,
) -> Procurement | None:
    procurement = (
        db.query(Procurement)
        .filter(Procurement.id == procurement_id)
        .first()
    )

    if procurement is None:
        return None

    mandi = (
        db.query(Mandi)
        .filter(
            Mandi.id == procurement.mandi_id,
            Mandi.owner_id == owner_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if mandi is None:
        raise ValueError(
            "Procurement does not belong to this mandi owner"
        )

    update_data = procurement_data.model_dump(
        exclude_unset=True,
    )

    if (
        "weighed_quantity" in update_data
        and update_data["weighed_quantity"] > procurement.booked_quantity
    ):
        raise ValueError(
            "Weighed quantity cannot exceed booked quantity"
        )

    for field, value in update_data.items():
        setattr(procurement, field, value)

    db.commit()
    db.refresh(procurement)

    return procurement

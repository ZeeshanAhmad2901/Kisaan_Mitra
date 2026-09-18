from datetime import datetime

from models.booking import Booking
from models.mandi import Mandi
from models.slot import Slot
from models.user import User
from models.vehicle import Vehicle
from schemas.booking import BookingCreate
from sqlalchemy.orm import Session


def _generate_booking_code() -> str:
    return f"KM-{datetime.utcnow().year}-{datetime.utcnow().strftime('%H%M%S%f')[-8:]}"


def create_booking(
    db: Session,
    booking_data: BookingCreate,
    farmer_id: int,
) -> dict:
    mandi = (
        db.query(Mandi)
        .filter(
            Mandi.id == booking_data.mandi_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if mandi is None:
        raise ValueError("Mandi not found or inactive")

    slot = (
        db.query(Slot)
        .filter(
            Slot.id == booking_data.slot_id,
            Slot.mandi_id == booking_data.mandi_id,
            Slot.is_active.is_(True),
        )
        .with_for_update()
        .first()
    )

    if slot is None:
        raise ValueError("Slot not found, inactive, or does not belong to this mandi")

    if slot.booked_slots >= slot.total_slots:
        raise ValueError("Selected slot is already full")

    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == booking_data.vehicle_id,
            Vehicle.farmer_id == farmer_id,
            Vehicle.is_active.is_(True),
        )
        .first()
    )

    if vehicle is None:
        raise ValueError("Vehicle not found or does not belong to this farmer")

    booking = Booking(
        booking_code=_generate_booking_code(),
        farmer_id=farmer_id,
        mandi_id=booking_data.mandi_id,
        slot_id=booking_data.slot_id,
        vehicle_id=booking_data.vehicle_id,
        crop_type=booking_data.crop_type,
        quantity=booking_data.quantity,
        booking_source=booking_data.booking_source,
        status="confirmed",
    )

    slot.booked_slots += 1

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "booking_code": booking.booking_code,
        "farmer_id": booking.farmer_id,
        "farmer_name": db.query(User).filter(User.id == farmer_id).first().name,
        "mandi_id": booking.mandi_id,
        "slot_id": booking.slot_id,
        "slot_date": slot.slot_date,
        "start_time": slot.start_time,
        "end_time": slot.end_time,
        "vehicle_id": booking.vehicle_id,
        "vehicle_number": vehicle.vehicle_number,
        "vehicle_type": vehicle.vehicle_type,
        "crop_type": booking.crop_type,
        "quantity": booking.quantity,
        "booking_source": booking.booking_source,
        "status": booking.status,
        "created_at": booking.created_at,
        "updated_at": booking.updated_at,
}

def create_assisted_booking(
    db: Session,
    booking_data,
) -> Booking:
    farmer = (
        db.query(User)
        .filter(
            User.id == booking_data.farmer_id,
            User.role == "farmer",
            User.is_active.is_(True),
        )
        .first()
    )

    if farmer is None:
        raise ValueError("Farmer not found or inactive")

    mandi = (
        db.query(Mandi)
        .filter(
            Mandi.id == booking_data.mandi_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if mandi is None:
        raise ValueError("Mandi not found or inactive")

    slot = (
        db.query(Slot)
        .filter(
            Slot.id == booking_data.slot_id,
            Slot.mandi_id == booking_data.mandi_id,
            Slot.is_active.is_(True),
        )
        .with_for_update()
        .first()
    )

    if slot is None:
        raise ValueError(
            "Slot not found, inactive, or does not belong to this mandi"
        )

    if slot.booked_slots >= slot.total_slots:
        raise ValueError("Selected slot is already full")

    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == booking_data.vehicle_id,
            Vehicle.farmer_id == booking_data.farmer_id,
            Vehicle.is_active.is_(True),
        )
        .first()
    )

    if vehicle is None:
        raise ValueError(
            "Vehicle not found or does not belong to this farmer"
        )

    booking = Booking(
        booking_code=_generate_booking_code(),
        farmer_id=booking_data.farmer_id,
        mandi_id=booking_data.mandi_id,
        slot_id=booking_data.slot_id,
        vehicle_id=booking_data.vehicle_id,
        crop_type=booking_data.crop_type,
        quantity=booking_data.quantity,
        booking_source="assisted",
        status="confirmed",
    )

    slot.booked_slots += 1

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "booking_code": booking.booking_code,
        "farmer_id": booking.farmer_id,
        "farmer_name": farmer.name,
        "mandi_id": booking.mandi_id,
        "slot_id": booking.slot_id,
        "slot_date": slot.slot_date,
        "start_time": slot.start_time,
        "end_time": slot.end_time,
        "vehicle_id": booking.vehicle_id,
        "vehicle_number": vehicle.vehicle_number,
        "vehicle_type": vehicle.vehicle_type,
        "crop_type": booking.crop_type,
        "quantity": booking.quantity,
        "booking_source": booking.booking_source,
        "status": booking.status,
        "created_at": booking.created_at,
        "updated_at": booking.updated_at,
    }

def get_booking(
    db: Session,
    booking_id: int,
) -> Booking | None:
    return (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )


def get_farmer_bookings(
    db: Session,
    farmer_id: int,
):
    rows = (
        db.query(
            Booking,
            Mandi.name.label("mandi_name"),
            Slot.slot_date,
            Slot.start_time,
            Slot.end_time,
            Vehicle.vehicle_number,
            Vehicle.vehicle_type,
        )
        .join(Mandi, Booking.mandi_id == Mandi.id)
        .join(Slot, Booking.slot_id == Slot.id)
        .join(Vehicle, Booking.vehicle_id == Vehicle.id)
        .filter(Booking.farmer_id == farmer_id)
        .order_by(Booking.created_at.desc(), Booking.id.desc())
        .all()
    )

    return [
        {
            "id": booking.id,
            "booking_code": booking.booking_code,
            "farmer_id": booking.farmer_id,
            "farmer_name": farmer_name,
            "mandi_id": booking.mandi_id,
            "slot_id": booking.slot_id,
            "slot_date": slot_date,
            "start_time": start_time,
            "end_time": end_time,
            "vehicle_id": booking.vehicle_id,
            "vehicle_number": vehicle_number,
            "vehicle_type": vehicle_type,
            "crop_type": booking.crop_type,
            "quantity": booking.quantity,
            "booking_source": booking.booking_source,
            "status": booking.status,
            "created_at": booking.created_at,
            "updated_at": booking.updated_at,
        }
        for (
            booking,
            farmer_name,
            slot_date,
            start_time,
            end_time,
            vehicle_number,
            vehicle_type,
        ) in rows
    ]

def get_mandi_bookings(
    db: Session,
    mandi_id: int,
    status_filter: str | None = None,
):
    query = (
        db.query(
            Booking,
            User.name.label("farmer_name"),
            Slot.slot_date,
            Slot.start_time,
            Slot.end_time,
            Vehicle.vehicle_number,
            Vehicle.vehicle_type,
        )
        .join(User, Booking.farmer_id == User.id)
        .join(Slot, Booking.slot_id == Slot.id)
        .join(Vehicle, Booking.vehicle_id == Vehicle.id)
        .filter(Booking.mandi_id == mandi_id)
    )

    if status_filter:
        query = query.filter(Booking.status == status_filter)

    rows = (
        query
        .order_by(Booking.created_at.asc(), Booking.id.asc())
        .all()
    )

    return [
        {
            "id": booking.id,
            "booking_code": booking.booking_code,
            "farmer_id": booking.farmer_id,
            "farmer_name": farmer_name,
            "mandi_id": booking.mandi_id,
            "slot_id": booking.slot_id,
            "slot_date": slot_date,
            "start_time": start_time,
            "end_time": end_time,
            "vehicle_id": booking.vehicle_id,
            "vehicle_number": vehicle_number,
            "vehicle_type": vehicle_type,
            "crop_type": booking.crop_type,
            "quantity": booking.quantity,
            "booking_source": booking.booking_source,
            "status": booking.status,
            "created_at": booking.created_at,
            "updated_at": booking.updated_at,
        }
        for (
            booking,
            farmer_name,
            slot_date,
            start_time,
            end_time,
            vehicle_number,
            vehicle_type,
        ) in rows
    ]


def start_processing(
    db: Session,
    booking_id: int,
    owner_id: int,
) -> Booking | None:
    booking = (
        db.query(Booking)
        .filter(
            Booking.id == booking_id,
            Booking.status == "confirmed",
        )
        .first()
    )

    if booking is None:
        return None

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

    active_booking = (
        db.query(Booking)
        .filter(
            Booking.mandi_id == booking.mandi_id,
            Booking.slot_id == booking.slot_id,
            Booking.status == "in_progress",
        )
        .first()
    )

    if active_booking is not None:
        raise ValueError("Another farmer is already being processed for this slot")

    first_confirmed = (
        db.query(Booking)
        .filter(
            Booking.mandi_id == booking.mandi_id,
            Booking.slot_id == booking.slot_id,
            Booking.status == "confirmed",
        )
        .order_by(Booking.created_at.asc(), Booking.id.asc())
        .first()
    )

    if first_confirmed is None or first_confirmed.id != booking.id:
        raise ValueError("Only the first farmer in the queue can be started")

    booking.status = "in_progress"

    db.commit()
    db.refresh(booking)

    return booking
def complete_booking(
    db: Session,
    booking_id: int,
    owner_id: int,
) -> Booking | None:
    booking = (
        db.query(Booking)
        .filter(
            Booking.id == booking_id,
            Booking.status == "in_progress",
        )
        .first()
    )

    if booking is None:
        return None

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

    booking.status = "completed"

    next_booking = (
        db.query(Booking)
        .filter(
            Booking.mandi_id == booking.mandi_id,
            Booking.slot_id == booking.slot_id,
            Booking.status == "confirmed",
        )
        .order_by(Booking.created_at.asc(), Booking.id.asc())
        .first()
    )

    if next_booking is not None:
        next_booking.status = "in_progress"

    db.commit()
    db.refresh(booking)

    return booking


from datetime import datetime

from models.booking import Booking
from models.mandi import Mandi
from models.slot import Slot
from models.user import User
from models.vehicle import Vehicle
from schemas.booking import BookingCreate, AssistedBookingCreate
from sqlalchemy.orm import Session


def _generate_booking_code() -> str:
    return f"KM-{datetime.utcnow().year}-{datetime.utcnow().strftime('%H%M%S%f')[-8:]}"


def _check_duplicate_booking(
    db: Session,
    farmer_id: int,
    mandi_id: int,
    slot: Slot,
) -> None:
    duplicate = (
        db.query(Booking)
        .join(Slot, Booking.slot_id == Slot.id)
        .filter(
            Booking.farmer_id == farmer_id,
            Booking.mandi_id == mandi_id,
            Slot.slot_date == slot.slot_date,
            Booking.status.in_(("confirmed", "in_progress")),
        )
        .first()
    )

    if duplicate is not None:
        raise ValueError(
            "Farmer already has an active booking at this mandi "
            f"for {slot.slot_date}"
        )


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
        raise ValueError(
            "Slot not found, inactive, or does not belong to this mandi"
        )

    if slot.booked_slots >= slot.total_slots:
        raise ValueError("Selected slot is already full")

    _check_duplicate_booking(
        db,
        farmer_id=farmer_id,
        mandi_id=booking_data.mandi_id,
        slot=slot,
    )

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
        raise ValueError(
            "Vehicle not found or does not belong to this farmer"
        )

    farmer = (
        db.query(User)
        .filter(
            User.id == farmer_id,
            User.role == "farmer",
            User.is_active.is_(True),
        )
        .first()
    )

    if farmer is None:
        raise ValueError("Farmer not found or inactive")

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
        "arrival_status": booking.arrival_status,
        "arrival_verified_at": booking.arrival_verified_at,
        "arrival_verified_by": booking.arrival_verified_by,
        "created_at": booking.created_at,
        "updated_at": booking.updated_at,
    }


def create_assisted_booking(
    db: Session,
    booking_data: AssistedBookingCreate,
) -> dict:
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

    _check_duplicate_booking(
        db,
        farmer_id=booking_data.farmer_id,
        mandi_id=booking_data.mandi_id,
        slot=slot,
    )

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
        "arrival_status": booking.arrival_status,
        "arrival_verified_at": booking.arrival_verified_at,
        "arrival_verified_by": booking.arrival_verified_by,
        "created_at": booking.created_at,
        "updated_at": booking.updated_at,
    }


def get_booking(
    db: Session,
    booking_id: int,
):
    row = (
        db.query(
            Booking,
            User.name.label("farmer_name"),
            Mandi.name.label("mandi_name"),
            Slot.slot_date,
            Slot.start_time,
            Slot.end_time,
            Vehicle.vehicle_number,
            Vehicle.vehicle_type,
        )
        .join(User, Booking.farmer_id == User.id)
        .join(Mandi, Booking.mandi_id == Mandi.id)
        .join(Slot, Booking.slot_id == Slot.id)
        .join(Vehicle, Booking.vehicle_id == Vehicle.id)
        .filter(Booking.id == booking_id)
        .first()
    )

    if row is None:
        return None

    (
        booking,
        farmer_name,
        mandi_name,
        slot_date,
        start_time,
        end_time,
        vehicle_number,
        vehicle_type,
    ) = row

    return {
        "id": booking.id,
        "booking_code": booking.booking_code,
        "farmer_id": booking.farmer_id,
        "farmer_name": farmer_name,
        "mandi_id": booking.mandi_id,
        "mandi_name": mandi_name,
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
        "arrival_status": booking.arrival_status,
        "arrival_verified_at": booking.arrival_verified_at,
        "arrival_verified_by": booking.arrival_verified_by,
        "created_at": booking.created_at,
        "updated_at": booking.updated_at,
    }


def get_farmer_bookings(
    db: Session,
    farmer_id: int,
):
    rows = (
        db.query(
            Booking,
            User.name.label("farmer_name"),
            Mandi.name.label("mandi_name"),
            Slot.slot_date,
            Slot.start_time,
            Slot.end_time,
            Vehicle.vehicle_number,
            Vehicle.vehicle_type,
        )
        .join(User, Booking.farmer_id == User.id)
        .join(Mandi, Booking.mandi_id == Mandi.id)
        .join(Slot, Booking.slot_id == Slot.id)
        .join(Vehicle, Booking.vehicle_id == Vehicle.id)
        .filter(Booking.farmer_id == farmer_id)
        .order_by(
            Booking.created_at.desc(),
            Booking.id.desc(),
        )
        .all()
    )

    return [
        {
            "id": booking.id,
            "booking_code": booking.booking_code,
            "farmer_id": booking.farmer_id,
            "farmer_name": farmer_name,
            "mandi_id": booking.mandi_id,
            "mandi_name": mandi_name,
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
            "arrival_status": booking.arrival_status,
            "arrival_verified_at": booking.arrival_verified_at,
            "arrival_verified_by": booking.arrival_verified_by,
            "created_at": booking.created_at,
            "updated_at": booking.updated_at,
        }
        for (
            booking,
            farmer_name,
            mandi_name,
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
            Mandi.name.label("mandi_name"),
            Slot.slot_date,
            Slot.start_time,
            Slot.end_time,
            Vehicle.vehicle_number,
            Vehicle.vehicle_type,
        )
        .join(User, Booking.farmer_id == User.id)
        .join(Mandi, Booking.mandi_id == Mandi.id)
        .join(Slot, Booking.slot_id == Slot.id)
        .join(Vehicle, Booking.vehicle_id == Vehicle.id)
        .filter(Booking.mandi_id == mandi_id)
    )

    if status_filter:
        query = query.filter(Booking.status == status_filter)

    rows = (
        query
        .order_by(
            Booking.created_at.asc(),
            Booking.id.asc(),
        )
        .all()
    )

    return [
        {
            "id": booking.id,
            "booking_code": booking.booking_code,
            "farmer_id": booking.farmer_id,
            "farmer_name": farmer_name,
            "mandi_id": booking.mandi_id,
            "mandi_name": mandi_name,
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
            "arrival_status": booking.arrival_status,
            "arrival_verified_at": booking.arrival_verified_at,
            "arrival_verified_by": booking.arrival_verified_by,
            "created_at": booking.created_at,
            "updated_at": booking.updated_at,
        }
        for (
            booking,
            farmer_name,
            mandi_name,
            slot_date,
            start_time,
            end_time,
            vehicle_number,
            vehicle_type,
        ) in rows
    ]


def cancel_booking(
    db: Session,
    booking_id: int,
    user_id: int,
    user_role: str,
    mandi_id: int | None = None,
) -> Booking | None:
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if booking is None:
        return None

    if booking.status != "confirmed":
        raise ValueError(
            "Only confirmed bookings can be cancelled"
        )

    if user_role == "farmer" and booking.farmer_id != user_id:
        raise ValueError(
            "You can only cancel your own booking"
        )

    if user_role == "mandiOperator" and booking.mandi_id != mandi_id:
        raise ValueError(
            "You do not have access to this mandi"
        )

    if user_role == "mandiOwner":
        mandi = (
            db.query(Mandi)
            .filter(Mandi.id == booking.mandi_id)
            .first()
        )
        if mandi is None or mandi.owner_id != user_id:
            raise ValueError(
                "You do not have access to this booking"
            )

    slot = (
        db.query(Slot)
        .filter(Slot.id == booking.slot_id)
        .with_for_update()
        .first()
    )

    if slot is None:
        raise ValueError("Booking slot not found")

    booking.status = "cancelled"
    slot.booked_slots = max(0, slot.booked_slots - 1)

    db.commit()
    db.refresh(booking)

    return booking


def reschedule_booking(
    db: Session,
    booking_id: int,
    new_slot_id: int,
    user_id: int,
    user_role: str,
    mandi_id: int | None = None,
) -> Booking | None:
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if booking is None:
        return None

    if booking.status != "confirmed":
        raise ValueError(
            "Only confirmed bookings can be rescheduled"
        )

    if user_role == "farmer" and booking.farmer_id != user_id:
        raise ValueError(
            "You can only reschedule your own booking"
        )

    if user_role == "mandiOperator" and booking.mandi_id != mandi_id:
        raise ValueError(
            "You do not have access to this mandi"
        )

    if user_role == "mandiOwner":
        mandi = (
            db.query(Mandi)
            .filter(Mandi.id == booking.mandi_id)
            .first()
        )
        if mandi is None or mandi.owner_id != user_id:
            raise ValueError(
                "You do not have access to this booking"
            )

    if booking.slot_id == new_slot_id:
        raise ValueError(
            "The new slot must be different from the current slot"
        )

    slots = (
        db.query(Slot)
        .filter(
            Slot.id.in_([booking.slot_id, new_slot_id])
        )
        .with_for_update()
        .all()
    )

    slot_map = {slot.id: slot for slot in slots}
    old_slot = slot_map.get(booking.slot_id)
    new_slot = slot_map.get(new_slot_id)

    if old_slot is None:
        raise ValueError("Current booking slot not found")

    if new_slot is None:
        raise ValueError("New slot not found")

    if not new_slot.is_active:
        raise ValueError("New slot is not active")

    if new_slot.mandi_id != booking.mandi_id:
        raise ValueError(
            "New slot must belong to the same mandi"
        )

    if new_slot.booked_slots >= new_slot.total_slots:
        raise ValueError(
            "New slot is already full"
        )

    duplicate = (
        db.query(Booking)
        .join(Slot, Booking.slot_id == Slot.id)
        .filter(
            Booking.id != booking.id,
            Booking.farmer_id == booking.farmer_id,
            Booking.mandi_id == booking.mandi_id,
            Slot.slot_date == new_slot.slot_date,
            Booking.status.in_(("confirmed", "in_progress")),
        )
        .first()
    )

    if duplicate is not None:
        raise ValueError(
            "Farmer already has an active booking at this mandi "
            f"for {new_slot.slot_date}"
        )

    old_slot.booked_slots = max(
        0,
        old_slot.booked_slots - 1,
    )
    new_slot.booked_slots += 1
    booking.slot_id = new_slot.id

    db.commit()
    db.refresh(booking)

    return booking

def start_processing(
    db: Session,
    booking_id: int,
    user_id: int,
    user_role: str,
    mandi_id: int | None = None,
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

    if booking.arrival_status != "verified":
        raise ValueError(
            "Farmer arrival must be confirmed before processing"
        )

    mandi = (
        db.query(Mandi)
        .filter(
            Mandi.id == booking.mandi_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if mandi is None:
        raise ValueError(
            "Booking does not belong to an active mandi"
        )

    if user_role == "mandiOwner":
        if mandi.owner_id != user_id:
            raise ValueError(
                "Booking does not belong to this mandi owner"
            )

    elif user_role == "mandiOperator":
        if mandi_id != booking.mandi_id:
            raise ValueError(
                "Operator is not assigned to this mandi"
            )

    else:
        raise ValueError(
            "User is not authorized to process bookings"
        )

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
        raise ValueError(
            "Another farmer is already being processed for this slot"
        )

    first_confirmed = (
        db.query(Booking)
        .filter(
            Booking.mandi_id == booking.mandi_id,
            Booking.slot_id == booking.slot_id,
            Booking.status == "confirmed",
        )
        .order_by(
            Booking.created_at.asc(),
            Booking.id.asc(),
        )
        .first()
    )

    if first_confirmed is None or first_confirmed.id != booking.id:
        raise ValueError(
            "Only the first farmer in the queue can be started"
        )

    booking.status = "in_progress"

    db.commit()
    db.refresh(booking)

    updated_bookings = get_mandi_bookings(
        db,
        booking.mandi_id,
    )

    return next(
        (
            item
            for item in updated_bookings
            if item["id"] == booking.id
        ),
        None,
    )


def complete_booking(
    db: Session,
    booking_id: int,
    user_id: int,
    user_role: str,
    mandi_id: int | None = None,
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
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if mandi is None:
        raise ValueError(
            "Booking does not belong to an active mandi"
        )

    if user_role == "mandiOwner":
        if mandi.owner_id != user_id:
            raise ValueError(
                "Booking does not belong to this mandi owner"
            )

    elif user_role == "mandiOperator":
        if mandi_id != booking.mandi_id:
            raise ValueError(
                "Operator is not assigned to this mandi"
            )

    else:
        raise ValueError(
            "User is not authorized to process bookings"
        )

    booking.status = "completed"

    next_booking = (
        db.query(Booking)
        .filter(
            Booking.mandi_id == booking.mandi_id,
            Booking.slot_id == booking.slot_id,
            Booking.status == "confirmed",
        )
        .order_by(
            Booking.created_at.asc(),
            Booking.id.asc(),
        )
        .first()
    )

    if next_booking is not None:
        next_booking.status = "in_progress"

    db.commit()
    db.refresh(booking)

    updated_bookings = get_mandi_bookings(
        db,
        booking.mandi_id,
    )

    return next(
        (
            item
            for item in updated_bookings
            if item["id"] == booking.id
        ),
        None,
    )


def confirm_arrival(
    db: Session,
    booking_id: int,
    user_id: int,
    user_role: str,
    mandi_id: int | None = None,
) -> Booking | None:
    booking = (
        db.query(Booking)
        .filter(Booking.id == booking_id)
        .first()
    )

    if booking is None:
        return None

    mandi = (
        db.query(Mandi)
        .filter(
            Mandi.id == booking.mandi_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if mandi is None:
        raise ValueError(
            "Booking does not belong to an active mandi"
        )

    if user_role == "mandiOwner":
        if mandi.owner_id != user_id:
            raise ValueError(
                "Booking does not belong to this mandi owner"
            )

    elif user_role == "mandiOperator":
        if mandi_id != booking.mandi_id:
            raise ValueError(
                "Operator is not assigned to this mandi"
            )

    elif user_role == "superAdmin":
        pass

    else:
        raise ValueError(
            "User is not authorized to confirm farmer arrival"
        )

    if booking.status == "completed":
        raise ValueError(
            "This booking has already been completed"
        )

    if booking.arrival_status == "verified":
        return booking

    booking.arrival_status = "verified"
    booking.arrival_verified_at = datetime.utcnow()
    booking.arrival_verified_by = user_id

    db.commit()
    db.refresh(booking)

    return booking

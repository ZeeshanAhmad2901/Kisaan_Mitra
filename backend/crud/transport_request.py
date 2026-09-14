from datetime import datetime

from models.transport_request import TransportRequest
from models.vehicle import Vehicle
from schemas.transport_request import TransportRequestCreate
from sqlalchemy.orm import Session


def create_transport_request(
    db: Session,
    request_data: TransportRequestCreate,
    farmer_id: int,
) -> TransportRequest:
    transport_request = TransportRequest(
        farmer_id=farmer_id,
        mandi_id=request_data.mandi_id,
        pickup_location=request_data.pickup_location,
        crop_type=request_data.crop_type,
        load_weight=request_data.load_weight,
        requested_date=request_data.requested_date,
        notes=request_data.notes,
        status="pending",
    )

    db.add(transport_request)
    db.commit()
    db.refresh(transport_request)

    return transport_request


def get_transport_request(
    db: Session,
    request_id: int,
) -> TransportRequest | None:
    return (
        db.query(TransportRequest)
        .filter(TransportRequest.id == request_id)
        .first()
    )


def get_farmer_requests(
    db: Session,
    farmer_id: int,
) -> list[TransportRequest]:
    return (
        db.query(TransportRequest)
        .filter(TransportRequest.farmer_id == farmer_id)
        .order_by(TransportRequest.id.desc())
        .all()
    )


def get_pending_requests(
    db: Session,
) -> list[TransportRequest]:
    return (
        db.query(TransportRequest)
        .filter(TransportRequest.status == "pending")
        .order_by(TransportRequest.id.desc())
        .all()
    )


def accept_transport_request(
    db: Session,
    request_id: int,
    driver_id: int,
    vehicle_id: int,
) -> TransportRequest | None:
    transport_request = (
        db.query(TransportRequest)
        .filter(
            TransportRequest.id == request_id,
            TransportRequest.status == "pending",
        )
        .first()
    )

    if transport_request is None:
        return None

    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id,
            Vehicle.driver_id == driver_id,
            Vehicle.is_active.is_(True),
        )
        .first()
    )

    if vehicle is None:
        raise ValueError(
            "Vehicle not found or vehicle does not belong to this driver"
        )

    transport_request.driver_id = driver_id
    transport_request.vehicle_id = vehicle_id
    transport_request.status = "accepted"

    db.commit()
    db.refresh(transport_request)

    return transport_request


def update_transport_status(
    db: Session,
    request_id: int,
    status: str,
) -> TransportRequest | None:
    transport_request = get_transport_request(db, request_id)

    if transport_request is None:
        return None

    transport_request.status = status

    db.commit()
    db.refresh(transport_request)

    return transport_request
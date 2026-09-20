from auth.roles import require_role
from crud.audit_log import create_audit_log
from crud.booking import (complete_booking, confirm_arrival,
                          create_assisted_booking, create_booking, get_booking,
                          get_farmer_bookings, get_mandi_bookings,
                          start_processing)
from crud.mandi import get_mandi_by_id
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, status
from models.booking import Booking
from models.user import User
from schemas.booking import (AssistedBookingCreate, BookingCreate,
                             BookingResponse)
from schemas.booking_verification import (BookingVerificationRequest,
                                          BookingVerificationResponse)
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("farmer")),
):
    try:
        return create_booking(
            db,
            booking_data,
            current_user["user_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "/assisted",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_assisted_booking(
    booking_data: AssistedBookingCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("mandiOwner", "mandiOperator")
    ),
):
    mandi = get_mandi_by_id(db, booking_data.mandi_id)

    if mandi is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mandi not found",
        )

    if current_user["role"] == "mandiOwner":
        if mandi.owner_id != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this mandi",
            )

    elif current_user["role"] == "mandiOperator":
        if current_user["mandi_id"] != booking_data.mandi_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this mandi",
            )

    try:
        booking = create_assisted_booking(
            db,
            booking_data,
        )

        actor = (
            db.query(User)
            .filter(User.id == current_user["user_id"])
            .first()
        )

        create_audit_log(
            db,
            actor_id=current_user["user_id"],
            actor_name=actor.name if actor else None,
            actor_role=current_user["role"],
            action="CREATE_ASSISTED_BOOKING",
            entity_type="booking",
            entity_id=str(booking["id"]),
            description="Mandi operator created an assisted booking for a farmer.",
            details={
                "booking_code": booking["booking_code"],
                "farmer_id": booking["farmer_id"],
                "mandi_id": booking["mandi_id"],
                "slot_id": booking["slot_id"],
                "crop_type": booking["crop_type"],
                "quantity": booking["quantity"],
                "booking_source": booking["booking_source"],
            },
        )

        db.commit()

        return booking

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.post(
    "/verify",
    response_model=BookingVerificationResponse,
)
def verify_booking(
    verification_data: BookingVerificationRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("mandiOwner", "mandiOperator", "superAdmin")
    ),
):
    booking = (
        db.query(Booking)
        .filter(
            Booking.booking_code
            == verification_data.booking_code.strip()
        )
        .first()
    )

    if booking is None:
        return BookingVerificationResponse(
            valid=False,
            message="Booking not found.",
        )

    mandi = get_mandi_by_id(db, booking.mandi_id)

    if mandi is None or not mandi.is_active:
        return BookingVerificationResponse(
            valid=False,
            message="Mandi is not active.",
        )

    if current_user["role"] == "mandiOwner":
        if mandi.owner_id != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this mandi",
            )

    elif current_user["role"] == "mandiOperator":
        if current_user["mandi_id"] != booking.mandi_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Booking does not belong to your assigned mandi",
            )

    farmer = (
        db.query(User)
        .filter(User.id == booking.farmer_id)
        .first()
    )

    if farmer is None or not farmer.is_active:
        return BookingVerificationResponse(
            valid=False,
            message="Farmer account is inactive or unavailable.",
        )

    if booking.status == "completed":
        return BookingVerificationResponse(
            valid=False,
            message="This booking has already been completed.",
            booking_id=booking.id,
            booking_code=booking.booking_code,
            farmer_id=booking.farmer_id,
            farmer_name=farmer.name,
            mandi_id=booking.mandi_id,
            crop_type=booking.crop_type,
            quantity=booking.quantity,
            status=booking.status,
        )

    return BookingVerificationResponse(
        valid=True,
        message="Farmer arrival confirmed successfully.",
        booking_id=booking.id,
        booking_code=booking.booking_code,
        farmer_id=booking.farmer_id,
        farmer_name=farmer.name if farmer else None,
        mandi_id=booking.mandi_id,
        crop_type=booking.crop_type,
        quantity=booking.quantity,
        status=booking.status,
        arrival_status=booking.arrival_status,
        arrival_verified_at=(
            booking.arrival_verified_at.isoformat()
            if booking.arrival_verified_at
            else None
        ),
        arrival_verified_by=booking.arrival_verified_by,
    )


@router.post(
    "/{booking_id}/arrival",
    response_model=BookingVerificationResponse,
)
def confirm_booking_arrival(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("mandiOwner", "mandiOperator", "superAdmin")
    ),
):
    try:
        booking = confirm_arrival(
            db=db,
            booking_id=booking_id,
            user_id=current_user["user_id"],
            user_role=current_user["role"],
            mandi_id=current_user.get("mandi_id"),
        )

        if booking is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found",
            )

        farmer = (
            db.query(User)
            .filter(User.id == booking.farmer_id)
            .first()
        )

        actor = (
            db.query(User)
            .filter(User.id == current_user["user_id"])
            .first()
        )

        create_audit_log(
    db,
    actor_id=current_user["user_id"],
    actor_name=actor.name if actor else None,
    actor_role=current_user["role"],
    action="VERIFY_BOOKING",
    entity_type="booking",
    entity_id=str(booking["id"]),
    description="Mandi operator started processing a confirmed booking.",
    details={
        "booking_code": booking["booking_code"],
        "farmer_id": booking["farmer_id"],
        "mandi_id": booking["mandi_id"],
        "status": booking["status"],
    },
)

        db.commit()

        return BookingVerificationResponse(
            valid=True,
            message="Farmer arrival confirmed successfully.",
            booking_id=booking.id,
            booking_code=booking.booking_code,
            farmer_id=booking.farmer_id,
            farmer_name=farmer.name if farmer else None,
            mandi_id=booking.mandi_id,
            crop_type=booking.crop_type,
            quantity=booking.quantity,
            status=booking.status,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/my",
    response_model=list[BookingResponse],
)
def list_my_bookings(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("farmer")),
):
    return get_farmer_bookings(
        db,
        current_user["user_id"],
    )


@router.get(
    "/mandi/{mandi_id}",
    response_model=list[BookingResponse],
)
def list_mandi_bookings(
    mandi_id: int,
    status_filter: str | None = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("mandiOwner", "mandiOperator", "superAdmin")
    ),
):
    mandi = get_mandi_by_id(db, mandi_id)

    if mandi is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mandi not found",
        )

    if (
        current_user["role"] == "mandiOwner"
        and mandi.owner_id != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this mandi",
        )

    if (
        current_user["role"] == "mandiOperator"
        and current_user.get("mandi_id") != mandi_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this mandi",
        )

    return get_mandi_bookings(
        db,
        mandi_id,
        status_filter,
    )


@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
)
def get_booking_by_id(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role(
            "farmer",
            "mandiOwner",
            "mandiOperator",
            "superAdmin",
        )
    ),
):
    booking = get_booking(db, booking_id)

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if (
        current_user["role"] == "farmer"
        and booking.farmer_id != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this booking",
        )

    if current_user["role"] == "mandiOwner":
        mandi = get_mandi_by_id(db, booking.mandi_id)

        if mandi is None or mandi.owner_id != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this booking",
            )

    if current_user["role"] == "mandiOperator":
        if current_user.get("mandi_id") != booking.mandi_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this booking",
            )

    return booking


@router.put(
    "/{booking_id}/start",
    response_model=BookingResponse,
)
def start_booking_processing(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("mandiOwner", "mandiOperator")
    ),
):
    try:
        booking = start_processing(
            db,
            booking_id,
            current_user["user_id"],
            current_user["role"],
            current_user["mandi_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Confirmed booking not found",
        )

    actor = (
        db.query(User)
        .filter(User.id == current_user["user_id"])
        .first()
    )

    create_audit_log(
            db,
            actor_id=current_user["user_id"],
            actor_name=actor.name if actor else None,
            actor_role=current_user["role"],
            action="START_BOOKING_PROCESSING",
            entity_type="booking",
            entity_id=str(booking.id),
            description="Mandi operator verified a booking.",
            details={
                "booking_code": booking.booking_code,
                "farmer_id": booking.farmer_id,
                "mandi_id": booking.mandi_id,
                "status": booking.status,
            },
        )

    db.commit()

    return booking


@router.put(
    "/{booking_id}/complete",
    response_model=BookingResponse,
)
def complete_booking_processing(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("mandiOwner", "mandiOperator")
    ),
):
    try:
        booking = complete_booking(
            db,
            booking_id,
            current_user["user_id"],
            current_user["role"],
            current_user["mandi_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="In-progress booking not found",
        )

    actor = (
        db.query(User)
        .filter(User.id == current_user["user_id"])
        .first()
    )

    create_audit_log(
        db,
        actor_id=current_user["user_id"],
        actor_name=actor.name if actor else None,
        actor_role=current_user["role"],
        action="COMPLETE_BOOKING_PROCESSING",
        entity_type="booking",
        entity_id=str(booking["id"]),
        description="Booking processing was completed.",
        details={
            "booking_code": booking["booking_code"],
            "farmer_id": booking["farmer_id"],
            "mandi_id": booking["mandi_id"],
            "status": booking["status"],
        },
    )
    db.commit()

    return booking

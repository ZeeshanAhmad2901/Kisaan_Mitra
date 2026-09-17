from auth.roles import require_role
from crud.booking import (
    complete_booking,
    create_booking,
    get_booking,
    get_farmer_bookings,
    get_mandi_bookings,
    start_processing,
)
from crud.mandi import get_mandi_by_id
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.booking import BookingCreate, BookingResponse
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
        require_role("mandiOwner", "superAdmin")
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
        require_role("farmer", "mandiOwner", "superAdmin")
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

    return booking


@router.put(
    "/{booking_id}/start",
    response_model=BookingResponse,
)
def start_booking_processing(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    try:
        booking = start_processing(
            db,
            booking_id,
            current_user["user_id"],
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

    return booking


@router.put(
    "/{booking_id}/complete",
    response_model=BookingResponse,
)
def complete_booking_processing(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    try:
        booking = complete_booking(
            db,
            booking_id,
            current_user["user_id"],
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

    return booking

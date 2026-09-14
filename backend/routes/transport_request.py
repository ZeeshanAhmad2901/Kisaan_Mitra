from auth.dependencies import get_current_user
from auth.roles import require_role
from crud.transport_request import (accept_transport_request,
                                    create_transport_request,
                                    get_farmer_requests, get_pending_requests,
                                    get_transport_request,
                                    update_transport_status)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.transport_request import (TransportRequestCreate,
                                       TransportRequestResponse)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/transport-requests",
    tags=["Transport Requests"],
)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/",
    response_model=TransportRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_request(
    request_data: TransportRequestCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("farmer")),
):
    try:
        return create_transport_request(
            db,
            request_data,
            current_user["user_id"],
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invalid farmer, mandi, or related database reference",
        ) from None

@router.get(
    "/my",
    response_model=list[TransportRequestResponse],
)
def list_my_requests(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("farmer")),
):
    return get_farmer_requests(
        db,
        current_user["user_id"],
    )


@router.get(
    "/pending",
    response_model=list[TransportRequestResponse],
)
def list_pending_requests(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("driver")),
):
    return get_pending_requests(db)


@router.get(
    "/{request_id}",
    response_model=TransportRequestResponse,
)
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    request = get_transport_request(db, request_id)

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transport request not found",
        )

    if (
        current_user["role"] == "farmer"
        and request.farmer_id != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this request",
        )

    if (
        current_user["role"] == "driver"
        and request.driver_id is not None
        and request.driver_id != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this request",
        )

    return request


@router.put(
    "/{request_id}/accept",
    response_model=TransportRequestResponse,
)
def accept_request(
    request_id: int,
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("driver")),
):
    try:
        request = accept_transport_request(
            db,
            request_id,
            current_user["user_id"],
            vehicle_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pending transport request not found",
        )

    return request


@router.put(
    "/{request_id}/status",
    response_model=TransportRequestResponse,
)
def change_status(
    request_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    allowed_statuses = {
        "accepted",
        "in_transit",
        "completed",
        "cancelled",
    }

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid transport request status",
        )

    request = get_transport_request(db, request_id)

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transport request not found",
        )

    if current_user["role"] == "farmer":
        if request.farmer_id != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this request",
            )

        if new_status != "cancelled":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Farmers can only cancel requests",
            )

    elif current_user["role"] == "driver":
        if request.driver_id != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this request",
            )

        if new_status not in {"in_transit", "completed"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Driver cannot set this status",
            )

    elif current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to change this status",
        )

    return update_transport_status(
        db,
        request_id,
        new_status,
    )
from auth.roles import require_role
from crud.mandi import get_mandi_by_id
from crud.procurement import (
    create_procurement,
    get_booking_procurement,
    get_farmer_procurements,
    get_mandi_procurements,
    get_procurement,
    update_procurement,
)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.procurement import (
    ProcurementCreate,
    ProcurementResponse,
    ProcurementUpdate,
)
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/procurements",
    tags=["Procurements"],
)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/",
    response_model=ProcurementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_procurement(
    procurement_data: ProcurementCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    try:
        return create_procurement(
            db,
            procurement_data,
            current_user["user_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/my",
    response_model=list[ProcurementResponse],
)
def list_my_procurements(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("farmer")),
):
    return get_farmer_procurements(
        db,
        current_user["user_id"],
    )


@router.get(
    "/mandi/{mandi_id}",
    response_model=list[ProcurementResponse],
)
def list_mandi_procurements_route(
    mandi_id: int,
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

    return get_mandi_procurements(
        db,
        mandi_id,
    )


@router.get(
    "/booking/{booking_id}",
    response_model=ProcurementResponse,
)
def get_booking_procurement_route(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("farmer", "mandiOwner", "superAdmin")
    ),
):
    procurement = get_booking_procurement(
        db,
        booking_id,
    )

    if procurement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Procurement not found for this booking",
        )

    if (
        current_user["role"] == "farmer"
        and procurement.farmer_id != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this procurement",
        )

    if current_user["role"] == "mandiOwner":
        mandi = get_mandi_by_id(db, procurement.mandi_id)

        if (
            mandi is None
            or mandi.owner_id != current_user["user_id"]
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this procurement",
            )

    return procurement


@router.get(
    "/{procurement_id}",
    response_model=ProcurementResponse,
)
def get_procurement_by_id(
    procurement_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("farmer", "mandiOwner", "superAdmin")
    ),
):
    procurement = get_procurement(
        db,
        procurement_id,
    )

    if procurement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Procurement not found",
        )

    if (
        current_user["role"] == "farmer"
        and procurement.farmer_id != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this procurement",
        )

    if current_user["role"] == "mandiOwner":
        mandi = get_mandi_by_id(db, procurement.mandi_id)

        if (
            mandi is None
            or mandi.owner_id != current_user["user_id"]
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this procurement",
            )

    return procurement


@router.put(
    "/{procurement_id}",
    response_model=ProcurementResponse,
)
def update_procurement_route(
    procurement_id: int,
    procurement_data: ProcurementUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    try:
        procurement = update_procurement(
            db,
            procurement_id,
            procurement_data,
            current_user["user_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc

    if procurement is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Procurement not found",
        )

    return procurement

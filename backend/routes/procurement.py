from auth.roles import require_role
from crud.audit_log import create_audit_log
from crud.mandi import get_mandi_by_id
from crud.notification import create_notification
from crud.procurement import (create_procurement, get_booking_procurement,
                              get_farmer_procurements, get_mandi_procurements,
                              get_procurement, update_procurement)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, status
from models.user import User
from schemas.procurement import (ProcurementCreate, ProcurementResponse,
                                 ProcurementUpdate)
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
    current_user: dict = Depends(
        require_role("mandiOwner", "mandiOperator")
    ),
):
    try:
        procurement = create_procurement(
            db,
            procurement_data,
            current_user["user_id"],
            current_user["role"],
            current_user.get("mandi_id"),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    actor = (
        db.query(User)
        .filter(User.id == current_user["user_id"])
        .first()
    )

    create_notification(
        db,
        user_id=procurement.farmer_id,
        title="Procurement Created",
        message=f"Procurement for booking {procurement.booking_id} has been created successfully.",
        notification_type="PROCUREMENT_CREATED",
        entity_type="procurement",
        entity_id=str(procurement.id),
    )
    create_audit_log(
        db,
        actor_id=current_user["user_id"],
        actor_name=actor.name if actor else None,
        actor_role=current_user["role"],
        action="CREATE_PROCUREMENT",
        entity_type="procurement",
        entity_id=str(procurement.id),
        description="Mandi operator created a procurement record.",
        details={
            "booking_id": procurement.booking_id,
            "farmer_id": procurement.farmer_id,
            "mandi_id": procurement.mandi_id,
            "crop_type": procurement.crop_type,
            "weighed_quantity": procurement.weighed_quantity,
            "quality_grade": procurement.quality_grade,
            "procurement_amount": procurement.procurement_amount,
            "procurement_status": procurement.procurement_status,
            "payment_status": procurement.payment_status,
        },
    )

    db.commit()

    return procurement


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
        require_role(
            "mandiOwner",
            "mandiOperator",
            "superAdmin",
        )
    ),
):
    mandi = get_mandi_by_id(db, mandi_id)

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
        if current_user.get("mandi_id") != mandi_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operator is not assigned to this mandi",
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
        require_role(
            "farmer",
            "mandiOwner",
            "mandiOperator",
            "superAdmin",
        )
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

    if current_user["role"] == "farmer":
        if procurement.farmer_id != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this procurement",
            )

    elif current_user["role"] == "mandiOwner":
        mandi = get_mandi_by_id(
            db,
            procurement.mandi_id,
        )

        if (
            mandi is None
            or mandi.owner_id != current_user["user_id"]
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this procurement",
            )

    elif current_user["role"] == "mandiOperator":
        if current_user.get("mandi_id") != procurement.mandi_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operator is not assigned to this mandi",
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
        require_role(
            "farmer",
            "mandiOwner",
            "mandiOperator",
            "superAdmin",
        )
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

    if current_user["role"] == "farmer":
        if procurement.farmer_id != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this procurement",
            )

    elif current_user["role"] == "mandiOwner":
        mandi = get_mandi_by_id(
            db,
            procurement.mandi_id,
        )

        if (
            mandi is None
            or mandi.owner_id != current_user["user_id"]
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this procurement",
            )

    elif current_user["role"] == "mandiOperator":
        if current_user.get("mandi_id") != procurement.mandi_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operator is not assigned to this mandi",
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
    current_user: dict = Depends(
        require_role("mandiOwner", "mandiOperator")
    ),
):
    try:
        procurement = update_procurement(
            db,
            procurement_id,
            procurement_data,
            current_user["user_id"],
            current_user["role"],
            current_user.get("mandi_id"),
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

    actor = (
        db.query(User)
        .filter(User.id == current_user["user_id"])
        .first()
    )

    update_data = procurement_data.model_dump(
        exclude_unset=True,
    )

    if "payment_status" in update_data:
        create_notification(
            db,
            user_id=procurement.farmer_id,
            title="Payment Status Updated",
            message=f"Payment status for your procurement #{procurement.id} is now {procurement.payment_status}.",
            notification_type="PAYMENT_UPDATED",
            entity_type="procurement",
            entity_id=str(procurement.id),
        )
    else:
        create_notification(
            db,
            user_id=procurement.farmer_id,
            title="Procurement Updated",
            message=f"Your procurement record #{procurement.id} has been updated.",
            notification_type="PROCUREMENT_UPDATED",
            entity_type="procurement",
            entity_id=str(procurement.id),
        )

    create_audit_log(
        db,
        actor_id=current_user["user_id"],
        actor_name=actor.name if actor else None,
        actor_role=current_user["role"],
        action="UPDATE_PROCUREMENT",
        entity_type="procurement",
        entity_id=str(procurement.id),
        description="Mandi operator updated a procurement record.",
        details={
            "booking_id": procurement.booking_id,
            "farmer_id": procurement.farmer_id,
            "mandi_id": procurement.mandi_id,
            "changed_fields": update_data,
            "procurement_status": procurement.procurement_status,
            "payment_status": procurement.payment_status,
        },
    )

    db.commit()

    return procurement

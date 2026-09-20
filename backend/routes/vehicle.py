from math import ceil

from auth.dependencies import get_current_user
from auth.roles import require_role
from crud.vehicle import (create_vehicle, deactivate_vehicle, get_all_vehicles,
                          get_farmer_vehicles, get_vehicle_by_id,
                          update_vehicle)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException
from models.vehicle import Vehicle
from schemas.vehicle import VehicleCreate, VehicleListResponse, VehicleResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=VehicleResponse)
def register_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("farmer")),
):
    try:
        return create_vehicle(
            db,
            vehicle,
            current_user["user_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc),
        ) from exc


@router.get(
    "/my",
    response_model=list[VehicleResponse],
)
def list_my_vehicles(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("farmer")),
):
    vehicles = (
        db.query(Vehicle)
        .filter(
            Vehicle.farmer_id == current_user["user_id"],
            Vehicle.is_active.is_(True),
        )
        .order_by(Vehicle.id)
        .all()
    )

    return vehicles


@router.get(
    "/farmer/{farmer_id}",
    response_model=list[VehicleResponse],
)
def list_farmer_vehicles(
    farmer_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("mandiOwner", "mandiOperator", "superAdmin")
    ),
):
    vehicles = get_farmer_vehicles(db, farmer_id)
    return vehicles


@router.get("/", response_model=VehicleListResponse)
def list_vehicles(
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page must be greater than or equal to 1",
        )

    if page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=400,
            detail="Page size must be between 1 and 100",
        )

    vehicles, total = get_all_vehicles(
        db,
        page=page,
        page_size=page_size,
        search=search,
    )

    pages = ceil(total / page_size) if total else 0

    return {
        "items": vehicles,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
    }


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def edit_vehicle(
    vehicle_id: int,
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("driver")),
):
    try:
        updated_vehicle = update_vehicle(
            db,
            vehicle_id,
            vehicle,
            current_user["user_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc),
        ) from exc

    if updated_vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return updated_vehicle


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("driver")),
):
    deleted_vehicle = deactivate_vehicle(
        db,
        vehicle_id,
        current_user["user_id"],
    )

    if deleted_vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return {"message": "Vehicle deactivated successfully"}
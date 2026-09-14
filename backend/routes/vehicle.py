from auth.dependencies import get_current_user
from auth.roles import require_role
from crud.vehicle import (create_vehicle, deactivate_vehicle, get_all_vehicles,
                          get_vehicle_by_id, update_vehicle)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException
from schemas.vehicle import VehicleCreate, VehicleResponse
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
    current_user: dict = Depends(require_role("driver")),
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


@router.get("/", response_model=list[VehicleResponse])
def list_vehicles(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_all_vehicles(db)


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
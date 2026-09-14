from auth.dependencies import get_current_user
from auth.roles import require_role
from crud.vehicle import create_vehicle, get_all_vehicles
from database.connection import engine
from fastapi import APIRouter, Depends
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
    current_user: dict = Depends(require_role("driver"))
):
    return create_vehicle(db, vehicle)

@router.get("/", response_model=list[VehicleResponse])
def list_vehicles(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_all_vehicles(db)
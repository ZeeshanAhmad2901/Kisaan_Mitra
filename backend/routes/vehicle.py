from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from crud.vehicle import create_vehicle
from database.connection import engine
from schemas.vehicle import VehicleCreate, VehicleResponse


router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=VehicleResponse)
def register_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    return create_vehicle(db, vehicle)
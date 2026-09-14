from sqlalchemy.orm import Session

from models.vehicle import Vehicle
from schemas.vehicle import VehicleCreate


def create_vehicle(db: Session, vehicle: VehicleCreate) -> Vehicle:
    db_vehicle = Vehicle(
        farmer_id=vehicle.farmer_id,
        vehicle_number=vehicle.vehicle_number,
        vehicle_type=vehicle.vehicle_type,
    )

    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)

    return db_vehicle
from models.vehicle import Vehicle
from schemas.vehicle import VehicleCreate
from sqlalchemy.orm import Session


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


def get_all_vehicles(db: Session) -> list[Vehicle]:
    return db.query(Vehicle).filter(Vehicle.is_active.is_(True)).all()

def get_vehicle_by_id(db: Session, vehicle_id: int) -> Vehicle | None:
    return (
        db.query(Vehicle)
        .filter(Vehicle.id == vehicle_id, Vehicle.is_active.is_(True))
        .first()
    )


def update_vehicle(
    db: Session,
    vehicle_id: int,
    vehicle_data: VehicleCreate,
) -> Vehicle | None:
    db_vehicle = get_vehicle_by_id(db, vehicle_id)

    if db_vehicle is None:
        return None

    db_vehicle.farmer_id = vehicle_data.farmer_id
    db_vehicle.vehicle_number = vehicle_data.vehicle_number
    db_vehicle.vehicle_type = vehicle_data.vehicle_type

    db.commit()
    db.refresh(db_vehicle)

    return db_vehicle


def deactivate_vehicle(db: Session, vehicle_id: int) -> Vehicle | None:
    db_vehicle = get_vehicle_by_id(db, vehicle_id)

    if db_vehicle is None:
        return None

    db_vehicle.is_active = False

    db.commit()
    db.refresh(db_vehicle)

    return db_vehicle
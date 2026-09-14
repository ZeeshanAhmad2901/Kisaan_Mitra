from models.vehicle import Vehicle
from schemas.vehicle import VehicleCreate
from sqlalchemy.orm import Session


def create_vehicle(
    db: Session,
    vehicle: VehicleCreate,
    driver_id: int,
) -> Vehicle:
    existing_vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.vehicle_number == vehicle.vehicle_number)
        .first()
    )

    if existing_vehicle is not None:
        raise ValueError("Vehicle number already exists")

    db_vehicle = Vehicle(
        farmer_id=vehicle.farmer_id,
        driver_id=driver_id,
        vehicle_number=vehicle.vehicle_number,
        vehicle_type=vehicle.vehicle_type,
    )

    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)

    return db_vehicle


def get_all_vehicles(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
) -> tuple[list[Vehicle], int]:
    query = db.query(Vehicle).filter(Vehicle.is_active.is_(True))

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            (Vehicle.vehicle_number.ilike(search_term))
            | (Vehicle.vehicle_type.ilike(search_term))
        )

    total = query.count()

    offset = (page - 1) * page_size

    vehicles = (
        query
        .order_by(Vehicle.id)
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return vehicles, total


def get_vehicle_by_id(
    db: Session,
    vehicle_id: int,
) -> Vehicle | None:
    return (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id,
            Vehicle.is_active.is_(True),
        )
        .first()
    )


def get_owned_vehicle(
    db: Session,
    vehicle_id: int,
    driver_id: int,
) -> Vehicle | None:
    return (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id,
            Vehicle.driver_id == driver_id,
            Vehicle.is_active.is_(True),
        )
        .first()
    )


def update_vehicle(
    db: Session,
    vehicle_id: int,
    vehicle_data: VehicleCreate,
    driver_id: int,
) -> Vehicle | None:
    db_vehicle = get_owned_vehicle(db, vehicle_id, driver_id)

    if db_vehicle is None:
        return None

    existing_vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.vehicle_number == vehicle_data.vehicle_number,
            Vehicle.id != vehicle_id,
        )
        .first()
    )

    if existing_vehicle is not None:
        raise ValueError("Vehicle number already exists")

    db_vehicle.farmer_id = vehicle_data.farmer_id
    db_vehicle.vehicle_number = vehicle_data.vehicle_number
    db_vehicle.vehicle_type = vehicle_data.vehicle_type

    db.commit()
    db.refresh(db_vehicle)

    return db_vehicle


def deactivate_vehicle(
    db: Session,
    vehicle_id: int,
    driver_id: int,
) -> Vehicle | None:
    db_vehicle = get_owned_vehicle(db, vehicle_id, driver_id)

    if db_vehicle is None:
        return None

    db_vehicle.is_active = False

    db.commit()
    db.refresh(db_vehicle)

    return db_vehicle
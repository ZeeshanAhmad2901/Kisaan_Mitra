from pydantic import BaseModel


class VehicleBase(BaseModel):
    farmer_id: int
    driver_id: int | None = None
    vehicle_number: str
    vehicle_type: str


class VehicleCreate(VehicleBase):
    pass


class VehicleResponse(VehicleBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
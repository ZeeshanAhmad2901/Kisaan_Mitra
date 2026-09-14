from pydantic import BaseModel, ConfigDict, Field


class VehicleBase(BaseModel):
    farmer_id: int = Field(..., ge=1)
    driver_id: int | None = Field(default=None, ge=1)
    vehicle_number: str = Field(..., min_length=3, max_length=20)
    vehicle_type: str = Field(..., min_length=2, max_length=50)


class VehicleCreate(VehicleBase):
    pass


class VehicleResponse(VehicleBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class VehicleListResponse(BaseModel):
    items: list[VehicleResponse]
    total: int
    page: int
    page_size: int
    pages: int
from datetime import datetime

from pydantic import BaseModel, Field

ALLOWED_STATUSES = {
    "pending",
    "accepted",
    "in_transit",
    "completed",
    "cancelled",
}


class TransportRequestCreate(BaseModel):
    mandi_id: int = Field(..., gt=0)
    pickup_location: str = Field(..., min_length=2, max_length=255)
    crop_type: str = Field(..., min_length=2, max_length=100)
    load_weight: float = Field(..., gt=0)
    requested_date: datetime
    notes: str | None = Field(None, max_length=1000)


class TransportRequestResponse(BaseModel):
    id: int
    farmer_id: int
    mandi_id: int
    driver_id: int | None
    vehicle_id: int | None
    pickup_location: str
    crop_type: str
    load_weight: float
    requested_date: datetime
    status: str
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
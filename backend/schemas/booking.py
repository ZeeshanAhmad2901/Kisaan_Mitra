from datetime import datetime

from pydantic import BaseModel, Field


ALLOWED_BOOKING_STATUSES = {
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
}


class BookingCreate(BaseModel):
    mandi_id: int = Field(..., gt=0)
    slot_id: int = Field(..., gt=0)
    vehicle_id: int = Field(..., gt=0)
    crop_type: str = Field(..., min_length=2, max_length=100)
    quantity: float = Field(..., gt=0)


class BookingResponse(BaseModel):
    id: int
    booking_code: str
    farmer_id: int
    mandi_id: int
    slot_id: int
    vehicle_id: int
    crop_type: str
    quantity: float
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

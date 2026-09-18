from datetime import date, datetime, time

from pydantic import BaseModel, Field

ALLOWED_BOOKING_STATUSES = {
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
}

ALLOWED_BOOKING_SOURCES = {
    "self",
    "assisted",
    "walk-in",
}


class BookingCreate(BaseModel):
    mandi_id: int = Field(..., gt=0)
    slot_id: int = Field(..., gt=0)
    vehicle_id: int = Field(..., gt=0)
    crop_type: str = Field(..., min_length=2, max_length=100)
    quantity: float = Field(..., gt=0)
    booking_source: str = Field(
        default="self",
        pattern="^(self|assisted|walk-in)$",
    )

class AssistedBookingCreate(BaseModel):
    farmer_id: int = Field(..., gt=0)
    mandi_id: int = Field(..., gt=0)
    slot_id: int = Field(..., gt=0)
    vehicle_id: int = Field(..., gt=0)
    crop_type: str = Field(..., min_length=2, max_length=100)
    quantity: float = Field(..., gt=0)
class BookingResponse(BaseModel):
    id: int
    booking_code: str
    farmer_id: int
    farmer_name: str
    mandi_id: int
    slot_id: int
    slot_date: date
    start_time: time
    end_time: time
    vehicle_id: int
    vehicle_number: str
    vehicle_type: str
    crop_type: str
    quantity: float
    booking_source: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
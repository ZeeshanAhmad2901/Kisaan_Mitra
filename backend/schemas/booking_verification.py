from pydantic import BaseModel, Field


class BookingVerificationRequest(BaseModel):
    booking_code: str = Field(..., min_length=3, max_length=30)


class BookingVerificationResponse(BaseModel):
    valid: bool
    message: str
    booking_id: int | None = None
    booking_code: str | None = None
    farmer_id: int | None = None
    farmer_name: str | None = None
    mandi_id: int | None = None
    crop_type: str | None = None
    quantity: float | None = None
    status: str | None = None
    arrival_status: str | None = None
    arrival_verified_at: str | None = None
    arrival_verified_by: int | None = None
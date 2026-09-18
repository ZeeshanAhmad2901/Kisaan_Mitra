from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class ProcurementCreate(BaseModel):
    booking_id: int = Field(..., ge=1)
    weighed_quantity: float = Field(..., gt=0)
    quality_grade: str = Field(..., min_length=1, max_length=50)
    procurement_amount: float = Field(..., ge=0)


class ProcurementUpdate(BaseModel):
    weighed_quantity: float | None = Field(default=None, gt=0)
    quality_grade: str | None = Field(default=None, min_length=1, max_length=50)
    procurement_amount: float | None = Field(default=None, ge=0)
    procurement_status: str | None = Field(default=None, min_length=1, max_length=30)
    payment_status: str | None = Field(default=None, min_length=1, max_length=30)


class ProcurementResponse(BaseModel):
    id: int
    booking_id: int
    farmer_id: int
    mandi_id: int
    crop_type: str
    booked_quantity: float
    weighed_quantity: float
    quality_grade: str
    procurement_amount: float
    procurement_status: str
    payment_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

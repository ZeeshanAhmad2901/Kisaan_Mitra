from datetime import date, time, datetime

from pydantic import BaseModel, Field


class SlotCreate(BaseModel):
    mandi_id: int = Field(..., gt=0)
    slot_date: date
    start_time: time
    end_time: time
    total_slots: int = Field(..., gt=0)


class SlotResponse(BaseModel):
    id: int
    mandi_id: int
    mandi_name: str
    slot_date: date
    start_time: time
    end_time: time
    total_slots: int
    booked_slots: int
    is_active: bool
    is_available: bool
    created_at: datetime

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SystemSettingResponse(BaseModel):
    id: int
    platform_name: str
    support_email: EmailStr
    support_phone: str

    max_bookings_per_farmer_per_day: int
    booking_window_days: int
    slot_duration_minutes: int

    enable_farmer_registration: bool
    enable_mandi_owner_registration: bool
    require_aadhaar_verification: bool
    enable_sms_notifications: bool
    maintenance_mode: bool

    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SystemSettingUpdate(BaseModel):
    platform_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    support_email: EmailStr

    support_phone: str = Field(
        ...,
        min_length=3,
        max_length=30,
    )

    max_bookings_per_farmer_per_day: int = Field(
        ...,
        ge=1,
        le=100,
    )

    booking_window_days: int = Field(
        ...,
        ge=1,
        le=365,
    )

    slot_duration_minutes: int = Field(
        ...,
        ge=15,
        le=1440,
    )

    enable_farmer_registration: bool
    enable_mandi_owner_registration: bool
    require_aadhaar_verification: bool
    enable_sms_notifications: bool
    maintenance_mode: bool
from datetime import datetime

from models.base import Base
from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    platform_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    support_email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    support_phone: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    max_bookings_per_farmer_per_day: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    booking_window_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    slot_duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    enable_farmer_registration: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
    )

    enable_mandi_owner_registration: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
    )

    require_aadhaar_verification: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
    )

    enable_sms_notifications: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
    )

    maintenance_mode: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
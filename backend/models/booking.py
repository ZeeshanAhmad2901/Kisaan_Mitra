from datetime import datetime

from models.base import Base
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    booking_code: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    farmer_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    mandi_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("mandis.id"),
        nullable=False,
        index=True,
    )

    slot_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("slots.id"),
        nullable=False,
        index=True,
    )

    vehicle_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=False,
        index=True,
    )

    crop_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    quantity: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    booking_source: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        server_default=text("'self'"),
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        server_default=text("'confirmed'"),
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    arrival_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        server_default=text("'pending'"),
        index=True,
    )

    arrival_verified_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    arrival_verified_by: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

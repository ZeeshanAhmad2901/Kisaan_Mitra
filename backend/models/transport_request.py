from datetime import datetime

from models.base import Base
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column


class TransportRequest(Base):
    __tablename__ = "transport_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

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

    driver_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    vehicle_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=True,
        index=True,
    )

    pickup_location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    crop_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    load_weight: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    requested_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        server_default=text("'pending'"),
        index=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
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
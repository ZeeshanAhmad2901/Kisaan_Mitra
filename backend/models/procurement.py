from datetime import datetime

from models.base import Base
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column


class Procurement(Base):
    __tablename__ = "procurements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    booking_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("bookings.id"),
        nullable=False,
        unique=True,
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

    crop_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    booked_quantity: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    weighed_quantity: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    quality_grade: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    procurement_amount: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    procurement_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        server_default=text("'pending'"),
        index=True,
    )

    payment_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        server_default=text("'pending'"),
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

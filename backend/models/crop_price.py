from datetime import date, datetime

from models.base import Base
from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column


class CropPrice(Base):
    __tablename__ = "crop_prices"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    mandi_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("mandis.id"),
        nullable=False,
        index=True,
    )

    crop_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    min_price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    max_price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    modal_price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    unit: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="per quintal",
    )

    price_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
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

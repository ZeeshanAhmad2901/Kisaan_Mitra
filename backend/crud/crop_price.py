from datetime import date

from models.crop_price import CropPrice
from models.mandi import Mandi
from schemas.crop_price import CropPriceCreate
from sqlalchemy.orm import Session


def create_crop_price(
    db: Session,
    price_data: CropPriceCreate,
    owner_id: int,
) -> CropPrice:
    mandi = (
        db.query(Mandi)
        .filter(
            Mandi.id == price_data.mandi_id,
            Mandi.owner_id == owner_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )

    if mandi is None:
        raise ValueError("Mandi not found or does not belong to this owner")

    existing_price = (
        db.query(CropPrice)
        .filter(
            CropPrice.mandi_id == price_data.mandi_id,
            CropPrice.crop_name == price_data.crop_name,
            CropPrice.price_date == price_data.price_date,
        )
        .first()
    )

    if existing_price is not None:
        raise ValueError(
            "A price for this crop, mandi, and date already exists"
        )

    crop_price = CropPrice(
        mandi_id=price_data.mandi_id,
        crop_name=price_data.crop_name.strip(),
        min_price=price_data.min_price,
        max_price=price_data.max_price,
        modal_price=price_data.modal_price,
        unit=price_data.unit.strip(),
        price_date=price_data.price_date,
    )

    db.add(crop_price)
    db.commit()
    db.refresh(crop_price)

    return crop_price


def get_crop_prices(
    db: Session,
    mandi_id: int | None = None,
    price_date: date | None = None,
) -> list[CropPrice]:
    query = db.query(CropPrice)

    if mandi_id is not None:
        query = query.filter(CropPrice.mandi_id == mandi_id)

    if price_date is not None:
        query = query.filter(CropPrice.price_date == price_date)

    return (
        query
        .order_by(
            CropPrice.price_date.desc(),
            CropPrice.crop_name.asc(),
            CropPrice.id.asc(),
        )
        .all()
    )


def get_crop_price_by_id(
    db: Session,
    price_id: int,
) -> CropPrice | None:
    return (
        db.query(CropPrice)
        .filter(CropPrice.id == price_id)
        .first()
    )

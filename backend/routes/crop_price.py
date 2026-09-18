from datetime import date

from auth.roles import require_role
from crud.crop_price import (
    create_crop_price,
    get_crop_price_by_id,
    get_crop_prices,
)
from database.connection import engine
from fastapi import APIRouter, Depends, HTTPException, status
from models.mandi import Mandi
from schemas.crop_price import CropPriceCreate, CropPriceResponse
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/crop-prices",
    tags=["Crop Prices"],
)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


def serialize_crop_price(price, db: Session) -> dict:
    mandi = (
        db.query(Mandi)
        .filter(Mandi.id == price.mandi_id)
        .first()
    )

    return {
        "id": price.id,
        "mandi_id": price.mandi_id,
        "mandi_name": mandi.name if mandi else "Unknown Mandi",
        "crop_name": price.crop_name,
        "min_price": price.min_price,
        "max_price": price.max_price,
        "modal_price": price.modal_price,
        "unit": price.unit,
        "price_date": price.price_date,
        "created_at": price.created_at,
        "updated_at": price.updated_at,
    }


@router.get(
    "/",
    response_model=list[CropPriceResponse],
)
def list_crop_prices(
    mandi_id: int | None = None,
    price_date: date | None = None,
    db: Session = Depends(get_db),
):
    prices = get_crop_prices(
        db,
        mandi_id=mandi_id,
        price_date=price_date,
    )

    return [
        serialize_crop_price(price, db)
        for price in prices
    ]


@router.get(
    "/{price_id}",
    response_model=CropPriceResponse,
)
def get_crop_price(
    price_id: int,
    db: Session = Depends(get_db),
):
    price = get_crop_price_by_id(db, price_id)

    if price is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop price not found",
        )

    return serialize_crop_price(price, db)


@router.post(
    "/",
    response_model=CropPriceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_crop_price(
    price_data: CropPriceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("mandiOwner")),
):
    try:
        price = create_crop_price(
            db,
            price_data,
            current_user["user_id"],
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return serialize_crop_price(price, db)

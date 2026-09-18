from datetime import date, datetime

from pydantic import BaseModel, Field, model_validator


class CropPriceCreate(BaseModel):
    mandi_id: int = Field(..., gt=0)
    crop_name: str = Field(..., min_length=2, max_length=100)
    min_price: float = Field(..., ge=0)
    max_price: float = Field(..., ge=0)
    modal_price: float = Field(..., ge=0)
    unit: str = Field(default="per quintal", min_length=2, max_length=50)
    price_date: date

    @model_validator(mode="after")
    def validate_prices(self):
        if self.min_price > self.max_price:
            raise ValueError("Minimum price cannot exceed maximum price")

        if not self.min_price <= self.modal_price <= self.max_price:
            raise ValueError(
                "Modal price must be between minimum and maximum price"
            )

        return self


class CropPriceResponse(BaseModel):
    id: int
    mandi_id: int
    mandi_name: str
    crop_name: str
    min_price: float
    max_price: float
    modal_price: float
    unit: str
    price_date: date
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

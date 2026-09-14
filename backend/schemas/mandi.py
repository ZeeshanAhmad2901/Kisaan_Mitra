from pydantic import BaseModel, Field


class MandiBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=255)
    owner_id: int


class MandiCreate(MandiBase):
    pass


class MandiResponse(MandiBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
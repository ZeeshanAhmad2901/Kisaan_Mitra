from pydantic import BaseModel, ConfigDict, Field


class MandiBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=255)
    owner_id: int


class MandiCreate(MandiBase):
    pass


class MandiResponse(MandiBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class MandiListResponse(BaseModel):
    items: list[MandiResponse]
    total: int
    page: int
    page_size: int
    pages: int        
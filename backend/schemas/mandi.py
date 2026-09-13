from pydantic import BaseModel


class MandiBase(BaseModel):
    name: str
    location: str
    owner_id: int


class MandiCreate(MandiBase):
    pass


class MandiResponse(MandiBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
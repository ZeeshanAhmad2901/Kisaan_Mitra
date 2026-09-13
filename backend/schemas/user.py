from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    phone: str
    email: EmailStr | None = None
    role: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
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
                
class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    role: str | None = None
    is_active: bool | None = None        
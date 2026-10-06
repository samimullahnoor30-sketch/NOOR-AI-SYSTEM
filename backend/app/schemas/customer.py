from datetime import datetime
from pydantic import BaseModel, EmailStr


class CustomerCreate(BaseModel):
    full_name: str
    phone: str
    email: EmailStr | None = None
    address: str | None = None
    notes: str | None = None


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    phone: str
    email: EmailStr | None = None
    address: str | None = None
    notes: str | None = None
    is_active: bool
    created_at: datetime


class CustomerUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    address: str | None = None
    notes: str | None = None
    is_active: bool | None = None
    
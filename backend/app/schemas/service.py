from datetime import datetime

from pydantic import BaseModel


class ServiceCreate(BaseModel):
    name: str
    category: str
    description: str | None = None
    price: str | None = None
    duration: str | None = None


class ServiceResponse(BaseModel):
    id: int
    name: str
    category: str
    description: str | None = None
    price: str | None = None
    duration: str | None = None
    is_active: bool
    created_at: datetime


class ServiceUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    description: str | None = None
    price: str | None = None
    duration: str | None = None
    is_active: bool | None = None
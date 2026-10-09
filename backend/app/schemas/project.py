from datetime import datetime

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    title: str
    project_type: str
    customer_id: int | None = None
    description: str | None = None
    status: str = "New"
    priority: str = "Normal"


class ProjectResponse(BaseModel):
    id: int
    title: str
    project_type: str
    customer_id: int | None = None
    description: str | None = None
    status: str
    priority: str
    is_active: bool
    created_at: datetime


class ProjectUpdate(BaseModel):
    title: str | None = None
    project_type: str | None = None
    customer_id: int | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    is_active: bool | None = None
    
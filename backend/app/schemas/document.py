from datetime import datetime

from pydantic import BaseModel


class DocumentCreate(BaseModel):
    title: str
    document_type: str
    customer_id: int | None = None
    project_id: int | None = None
    file_path: str | None = None
    description: str | None = None
    status: str = "Draft"


class DocumentResponse(BaseModel):
    id: int
    title: str
    document_type: str
    customer_id: int | None = None
    project_id: int | None = None
    file_path: str | None = None
    description: str | None = None
    status: str
    is_active: bool
    created_at: datetime


class DocumentUpdate(BaseModel):
    title: str | None = None
    document_type: str | None = None
    customer_id: int | None = None
    project_id: int | None = None
    file_path: str | None = None
    description: str | None = None
    status: str | None = None
    is_active: bool | None = None

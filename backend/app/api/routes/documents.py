from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.document import Document
from app.models.customer import Customer
from app.models.project import Project
from app.schemas.document import (
    DocumentCreate,
    DocumentResponse,
    DocumentUpdate,
)

router = APIRouter(prefix="/api/documents", tags=["Documents"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def validate_related_records(
    db: Session,
    customer_id: int | None,
    project_id: int | None,
):
    if customer_id is not None:
        customer = (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )
        if customer is None:
            raise HTTPException(
                status_code=404,
                detail="Customer not found. Please select a valid customer.",
            )

    if project_id is not None:
        project = (
            db.query(Project)
            .filter(Project.id == project_id)
            .first()
        )
        if project is None:
            raise HTTPException(
                status_code=404,
                detail="Project not found. Please select a valid project.",
            )

        if (
            customer_id is not None
            and project.customer_id is not None
            and project.customer_id != customer_id
        ):
            raise HTTPException(
                status_code=400,
                detail="The selected project does not belong to the selected customer.",
            )


@router.get("/", response_model=list[DocumentResponse])
def get_documents(db: Session = Depends(get_db)):
    return (
        db.query(Document)
        .filter(Document.is_active.is_(True))
        .order_by(Document.created_at.desc())
        .all()
    )


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.is_active.is_(True),
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return document


@router.post("/", response_model=DocumentResponse, status_code=201)
def create_document(
    document_data: DocumentCreate,
    db: Session = Depends(get_db),
):
    validate_related_records(
        db,
        document_data.customer_id,
        document_data.project_id,
    )

    document = Document(**document_data.model_dump())

    try:
        db.add(document)
        db.commit()
        db.refresh(document)
        return document
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Document could not be created. Please try again.",
        )


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    document_data: DocumentUpdate,
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.is_active.is_(True),
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    update_data = document_data.model_dump(exclude_unset=True)

    new_customer_id = update_data.get(
        "customer_id",
        document.customer_id,
    )
    new_project_id = update_data.get(
        "project_id",
        document.project_id,
    )

    validate_related_records(
        db,
        new_customer_id,
        new_project_id,
    )

    for field, value in update_data.items():
        setattr(document, field, value)

    try:
        db.commit()
        db.refresh(document)
        return document
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Document could not be updated. Please try again.",
        )


@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.is_active.is_(True),
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    document.is_active = False

    try:
        db.commit()
        return {
            "message": "Document deleted successfully",
            "document_id": document_id,
        }
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Document could not be deleted. Please try again.",
        )

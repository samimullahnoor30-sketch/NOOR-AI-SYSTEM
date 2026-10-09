from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.document import Document
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


@router.get("/", response_model=list[DocumentResponse])
def get_documents(db: Session = Depends(get_db)):
    return (
        db.query(Document)
        .filter(Document.is_active.is_(True))
        .order_by(Document.created_at.desc())
        .all()
    )


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.is_active.is_(True),
        )
        .first()
    )

    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    return document


@router.post("/", response_model=DocumentResponse, status_code=201)
def create_document(
    document_data: DocumentCreate,
    db: Session = Depends(get_db),
):
    document = Document(**document_data.model_dump())
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


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
        raise HTTPException(status_code=404, detail="Document not found")

    update_data = document_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(document, field, value)

    db.commit()
    db.refresh(document)
    return document


@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.is_active.is_(True),
        )
        .first()
    )

    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    document.is_active = False
    db.commit()

    return {
        "message": "Document deleted successfully",
        "document_id": document_id,
    }

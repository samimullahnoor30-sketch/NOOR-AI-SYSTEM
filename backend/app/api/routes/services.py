from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceResponse, ServiceUpdate


router = APIRouter(
    prefix="/api/services",
    tags=["Services"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).all()


@router.post("/", response_model=ServiceResponse)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
):
    existing_service = (
        db.query(Service)
        .filter(Service.name == service.name)
        .first()
    )

    if existing_service is not None:
        raise HTTPException(
            status_code=400,
            detail="Service with this name already exists",
        )

    new_service = Service(
        name=service.name,
        category=service.category,
        description=service.description,
        price=service.price,
        duration=service.duration,
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return new_service


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service: ServiceUpdate,
    db: Session = Depends(get_db),
):
    existing_service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if existing_service is None:
        raise HTTPException(
            status_code=404,
            detail="Service not found",
        )

    update_data = service.model_dump(exclude_unset=True)

    if "name" in update_data:
        duplicate_service = (
            db.query(Service)
            .filter(
                Service.name == update_data["name"],
                Service.id != service_id,
            )
            .first()
        )

        if duplicate_service is not None:
            raise HTTPException(
                status_code=400,
                detail="Service with this name already exists",
            )

    for field, value in update_data.items():
        setattr(existing_service, field, value)

    db.commit()
    db.refresh(existing_service)

    return existing_service


@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
):
    existing_service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if existing_service is None:
        raise HTTPException(
            status_code=404,
            detail="Service not found",
        )

    db.delete(existing_service)
    db.commit()

    return {
        "message": "Service deleted successfully",
        "service_id": service_id,
    }
    
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.project import Project
from app.models.customer import Customer
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return (
        db.query(Project)
        .order_by(Project.id.desc())
        .all()
    )


@router.post("/", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
    # Validate customer if a customer ID was provided.
    if project.customer_id is not None:
        customer = (
            db.query(Customer)
            .filter(Customer.id == project.customer_id)
            .first()
        )

        if customer is None:
            raise HTTPException(
                status_code=404,
                detail="Customer not found. Please select a valid customer.",
            )

    new_project = Project(
        title=project.title,
        project_type=project.project_type,
        customer_id=project.customer_id,
        description=project.description,
        status=project.status,
        priority=project.priority,
    )

    try:
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        return new_project
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Project could not be created. Please try again.",
        )


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
):
    existing_project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if existing_project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    update_data = project.model_dump(exclude_unset=True)

    # Validate customer ID when it is included in the update.
    if (
        "customer_id" in update_data
        and update_data["customer_id"] is not None
    ):
        customer = (
            db.query(Customer)
            .filter(Customer.id == update_data["customer_id"])
            .first()
        )

        if customer is None:
            raise HTTPException(
                status_code=404,
                detail="Customer not found. Please select a valid customer.",
            )

    for field, value in update_data.items():
        setattr(existing_project, field, value)

    try:
        db.commit()
        db.refresh(existing_project)
        return existing_project
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Project could not be updated. Please try again.",
        )


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    existing_project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if existing_project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    try:
        db.delete(existing_project)
        db.commit()
        return {
            "message": "Project deleted successfully.",
            "project_id": project_id,
        }
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Project could not be deleted. Please try again.",
        )


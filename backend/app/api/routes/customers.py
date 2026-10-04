from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse, CustomerUpdate


router = APIRouter(
    prefix="/api/customers",
    tags=["Customers"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()


@router.post("/", response_model=CustomerResponse)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
):
    new_customer = Customer(
        full_name=customer.full_name,
        phone=customer.phone,
        email=customer.email,
        address=customer.address,
        notes=customer.notes,
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer: CustomerUpdate,
    db: Session = Depends(get_db),
):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if existing_customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    update_data = customer.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(existing_customer, field, value)

    db.commit()
    db.refresh(existing_customer)

    return existing_customer


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if existing_customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    db.delete(existing_customer)
    db.commit()

    return {
        "message": "Customer deleted successfully",
        "customer_id": customer_id,
    }
    
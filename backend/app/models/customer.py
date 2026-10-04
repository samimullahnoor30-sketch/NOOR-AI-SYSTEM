from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from app.models.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=False, index=True)
    email = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

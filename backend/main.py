from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.api.routes.customers import router as customers_router
from app.api.routes.services import router as services_router
from app.api.routes.projects import router as projects_router
from app.api.routes.projects import router as projects_router
from app.models.customer import Customer
from app.models.service import Service


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="NOOR AI SYSTEM",
    version="1.0.0",
    description="NOOR AI SYSTEM Backend API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(customers_router)
app.include_router(services_router)
app.include_router(projects_router)

@app.get("/")
def home():
    return {
        "message": "NOOR AI SYSTEM is running successfully!",
        "version": "1.0.0",
        "status": "online",
    }
    
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.customers import router as customers_router


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


@app.get("/")
def home():
    return {
        "message": "NOOR AI SYSTEM is running successfully!",
        "version": "1.0.0",
        "status": "online",
    }
    
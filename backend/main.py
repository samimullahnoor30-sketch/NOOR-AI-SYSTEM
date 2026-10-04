from fastapi import FastAPI

from app.api.routes.customers import router as customers_router

app = FastAPI(
    title="NOOR AI SYSTEM",
)

app.include_router(customers_router)


@app.get("/")
def home():
    return {
        "message": "NOOR AI SYSTEM is running successfully!"
    }
    
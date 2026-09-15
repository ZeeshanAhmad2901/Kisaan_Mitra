from database.connection import engine
from error_handlers import unexpected_exception_handler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.current_user import router as current_user_router
from routes.login import router as login_router
from routes.mandi import router as mandi_router
from routes.protected import router as protected_router
from routes.transport_request import router as transport_request_router
from routes.user import router as user_router
from routes.vehicle import router as vehicle_router
from sqlalchemy import text

from config import ALLOWED_ORIGINS

app = FastAPI(title="Kisaan Mitra API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(
    Exception,
    unexpected_exception_handler,
)
app.include_router(transport_request_router)
app.include_router(current_user_router)
app.include_router(user_router)
app.include_router(mandi_router)
app.include_router(vehicle_router)
app.include_router(login_router)
app.include_router(protected_router)


@app.get("/")
def root():
    return {"message": "Kisaan Mitra API is running"}

@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception:
        return {
            "status": "unhealthy",
            "database": "unavailable",
        }
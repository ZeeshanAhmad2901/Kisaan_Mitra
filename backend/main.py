from fastapi import FastAPI
from routes.current_user import router as current_user_router
from routes.login import router as login_router
from routes.mandi import router as mandi_router
from routes.protected import router as protected_router
from routes.user import router as user_router
from routes.vehicle import router as vehicle_router

app = FastAPI(title="Kisaan Mitra API")

app.include_router(user_router)
app.include_router(mandi_router)
app.include_router(vehicle_router)
app.include_router(login_router)
app.include_router(protected_router)
app.include_router(current_user_router)


@app.get("/")
def root():
    return {"message": "Kisaan Mitra API is running"}
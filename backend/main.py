from fastapi import FastAPI

from routes.user import router as user_router
from routes.mandi import router as mandi_router
from routes.vehicle import router as vehicle_router


app = FastAPI(title="Kisaan Mitra API")


app.include_router(user_router)
app.include_router(mandi_router)
app.include_router(vehicle_router)


@app.get("/")
def root():
    return {"message": "Kisaan Mitra API is running"}
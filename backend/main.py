from fastapi import FastAPI

app = FastAPI(title="Kisaan Mitra API")


@app.get("/")
def root():
    return {"message": "Kisaan Mitra API is running"}
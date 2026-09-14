from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_mandi_requires_authentication():
    response = client.get("/mandis/")
    assert response.status_code in (401, 403)


def test_vehicle_requires_authentication():
    response = client.get("/vehicles/")
    assert response.status_code in (401, 403)
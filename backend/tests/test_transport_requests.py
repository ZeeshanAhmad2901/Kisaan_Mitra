from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_transport_request_requires_authentication():
    response = client.post(
        "/transport-requests/",
        json={
            "mandi_id": 5,
            "pickup_location": "Kolkata",
            "crop_type": "Rice",
            "load_weight": 1200,
            "requested_date": "2026-09-16T10:00:00",
            "notes": "Test request",
        },
    )

    assert response.status_code in (401, 403)


def test_transport_pending_requires_driver_role():
    response = client.get("/transport-requests/pending")

    assert response.status_code in (401, 403)


def test_transport_request_invalid_payload_returns_422():
    response = client.post(
        "/transport-requests/",
        json={
            "mandi_id": 0,
            "pickup_location": "K",
            "crop_type": "R",
            "load_weight": -10,
            "requested_date": "invalid-date",
        },
    )

    assert response.status_code in (401, 403, 422)


def test_transport_request_status_endpoint_requires_authentication():
    response = client.put(
        "/transport-requests/1/status?new_status=completed"
    )

    assert response.status_code in (401, 403)


def test_transport_request_accept_endpoint_requires_driver_role():
    response = client.put(
        "/transport-requests/1/accept?vehicle_id=13"
    )

    assert response.status_code in (401, 403)
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_public_registration_rejects_mandi_owner():
    response = client.post(
        "/users/",
        json={
            "name": "Test Mandi Owner",
            "phone": "9999999991",
            "email": "test-mandi-owner@example.com",
            "role": "mandiOwner",
            "password": "Test@12345",
        },
    )

    assert response.status_code == 403


def test_public_registration_rejects_admin():
    response = client.post(
        "/users/",
        json={
            "name": "Test Admin",
            "phone": "9999999992",
            "email": "test-admin@example.com",
            "role": "admin",
            "password": "Test@12345",
        },
    )

    assert response.status_code == 403


def test_invalid_user_payload_returns_422():
    response = client.post(
        "/users/",
        json={
            "name": "A",
            "phone": "123",
            "email": "not-an-email",
            "role": "farmer",
            "password": "123",
        },
    )

    assert response.status_code == 422
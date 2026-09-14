from unittest.mock import patch

from auth.password import hash_password, verify_password
from auth.roles import require_role
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_login_returns_429_when_ip_is_locked():
    with patch(
        "routes.login.is_login_locked",
        return_value=True,
    ):
        response = client.post(
            "/users/login",
            data={
                "username": "9999999901",
                "password": "WrongPassword",
            },
        )

    assert response.status_code == 429
    assert response.json()["detail"] == (
        "Too many failed login attempts. Try again later."
    )


def test_password_hash_and_verify():
    password = "Test@12345"

    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("WrongPassword", hashed)


def test_require_role_allows_matching_role():
    checker = require_role("admin")

    current_user = {
        "user_id": 12,
        "role": "admin",
    }

    assert checker(current_user) == current_user


def test_require_role_rejects_wrong_role():
    checker = require_role("admin")

    current_user = {
        "user_id": 8,
        "role": "driver",
    }

    try:
        checker(current_user)
        assert False, "Expected role check to reject the user"
    except Exception:
        assert True
from auth.password import hash_password, verify_password
from auth.roles import require_role


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
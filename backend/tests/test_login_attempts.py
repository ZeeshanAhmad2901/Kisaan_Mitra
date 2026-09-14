from datetime import datetime, timedelta

from crud.login_attempt import (is_login_locked, record_failed_login,
                                reset_login_attempt)
from models.login_attempt import LoginAttempt


class FakeQuery:
    def __init__(self, item=None):
        self.item = item

    def filter(self, *args):
        return self

    def first(self):
        return self.item


class FakeSession:
    def __init__(self, existing=None):
        self.item = existing
        self.added = None
        self.committed = False

    def query(self, model):
        return FakeQuery(self.item)

    def add(self, item):
        self.added = item
        self.item = item

    def commit(self):
        self.committed = True


def test_record_failed_login_creates_attempt():
    db = FakeSession()

    record_failed_login(
        db,
        "9999999901",
        "127.0.0.1",
    )

    assert db.added is not None
    assert db.added.phone == "9999999901"
    assert db.added.ip_address == "127.0.0.1"
    assert db.added.failed_attempts == 1
    assert db.committed


def test_record_failed_login_locks_after_five_attempts():
    attempt = LoginAttempt(
        phone="9999999902",
        ip_address="127.0.0.1",
        failed_attempts=4,
        last_attempt_at=datetime.utcnow(),
        locked_until=None,
    )

    db = FakeSession(attempt)

    record_failed_login(
        db,
        "9999999902",
        "127.0.0.1",
    )

    assert attempt.failed_attempts == 5
    assert attempt.locked_until is not None
    assert attempt.locked_until > datetime.utcnow()


def test_is_login_locked_returns_true_for_active_lock():
    attempt = LoginAttempt(
        phone="9999999903",
        ip_address="127.0.0.1",
        failed_attempts=5,
        last_attempt_at=datetime.utcnow(),
        locked_until=datetime.utcnow() + timedelta(minutes=10),
    )

    db = FakeSession(attempt)

    assert is_login_locked(
        db,
        "9999999903",
        "127.0.0.1",
    )


def test_expired_lock_is_cleared():
    attempt = LoginAttempt(
        phone="9999999904",
        ip_address="127.0.0.1",
        failed_attempts=5,
        last_attempt_at=datetime.utcnow(),
        locked_until=datetime.utcnow() - timedelta(minutes=1),
    )

    db = FakeSession(attempt)

    assert not is_login_locked(
        db,
        "9999999904",
        "127.0.0.1",
    )

    assert attempt.failed_attempts == 0
    assert attempt.locked_until is None
    assert db.committed


def test_reset_login_attempt_clears_failures():
    attempt = LoginAttempt(
        phone="9999999905",
        ip_address="127.0.0.1",
        failed_attempts=5,
        last_attempt_at=datetime.utcnow(),
        locked_until=datetime.utcnow() + timedelta(minutes=10),
    )

    db = FakeSession(attempt)

    reset_login_attempt(
        db,
        "9999999905",
        "127.0.0.1",
    )

    assert attempt.failed_attempts == 0
    assert attempt.locked_until is None
    assert db.committed
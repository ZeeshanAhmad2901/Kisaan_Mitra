from datetime import datetime, timedelta, timezone

from models.login_attempt import LoginAttempt
from sqlalchemy.orm import Session

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def get_login_attempt(
    db: Session,
    phone: str,
    ip_address: str,
) -> LoginAttempt | None:
    return (
        db.query(LoginAttempt)
        .filter(
            LoginAttempt.phone == phone,
            LoginAttempt.ip_address == ip_address,
        )
        .first()
    )


def is_login_locked(
    db: Session,
    phone: str,
    ip_address: str,
) -> bool:
    attempt = get_login_attempt(db, phone, ip_address)

    if attempt is None or attempt.locked_until is None:
        return False

    now = datetime.now(timezone.utc).replace(tzinfo=None)

    if attempt.locked_until > now:
        return True

    attempt.locked_until = None
    attempt.failed_attempts = 0
    db.commit()

    return False


def record_failed_login(
    db: Session,
    phone: str,
    ip_address: str,
) -> None:
    attempt = get_login_attempt(db, phone, ip_address)

    now = datetime.now(timezone.utc).replace(tzinfo=None)

    if attempt is None:
        attempt = LoginAttempt(
            phone=phone,
            ip_address=ip_address,
            failed_attempts=1,
            last_attempt_at=now,
            locked_until=None,
        )
        db.add(attempt)
    else:
        attempt.failed_attempts += 1
        attempt.last_attempt_at = now

        if attempt.failed_attempts >= MAX_FAILED_ATTEMPTS:
            attempt.locked_until = now + timedelta(
                minutes=LOCKOUT_MINUTES
            )

    db.commit()


def reset_login_attempt(
    db: Session,
    phone: str,
    ip_address: str,
) -> None:
    attempt = get_login_attempt(db, phone, ip_address)

    if attempt is None:
        return

    attempt.failed_attempts = 0
    attempt.locked_until = None
    attempt.last_attempt_at = datetime.now(timezone.utc).replace(
        tzinfo=None
    )

    db.commit()
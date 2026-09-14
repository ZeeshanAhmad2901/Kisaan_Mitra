from auth.password import hash_password
from models.user import User
from schemas.user import UserCreate, UserUpdate
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(
        name=user.name,
        phone=user.phone,
        email=user.email,
        password_hash=hash_password(user.password),
        role=user.role,
    )

    db.add(db_user)

    try:
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise ValueError("Phone number or email already exists") from None

    return db_user


def get_all_users(db: Session) -> list[User]:
    return db.query(User).all()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def update_user(
    db: Session,
    user_id: int,
    user_data: UserUpdate,
) -> User | None:
    db_user = get_user_by_id(db, user_id)

    if db_user is None:
        return None

    update_data = user_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)

    return db_user


def deactivate_user(db: Session, user_id: int) -> User | None:
    db_user = get_user_by_id(db, user_id)

    if db_user is None:
        return None

    db_user.is_active = False

    db.commit()
    db.refresh(db_user)

    return db_user
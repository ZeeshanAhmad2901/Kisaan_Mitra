from models.mandi import Mandi
from schemas.mandi import MandiCreate
from sqlalchemy.orm import Session


def create_mandi(
    db: Session,
    mandi: MandiCreate,
    owner_id: int,
) -> Mandi:
    db_mandi = Mandi(
        name=mandi.name,
        location=mandi.location,
        owner_id=owner_id,
    )

    db.add(db_mandi)
    db.commit()
    db.refresh(db_mandi)

    return db_mandi


def get_all_mandis(db: Session) -> list[Mandi]:
    return db.query(Mandi).filter(Mandi.is_active.is_(True)).all()


def get_mandi_by_id(
    db: Session,
    mandi_id: int,
) -> Mandi | None:
    return (
        db.query(Mandi)
        .filter(
            Mandi.id == mandi_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )


def get_owned_mandi(
    db: Session,
    mandi_id: int,
    owner_id: int,
) -> Mandi | None:
    return (
        db.query(Mandi)
        .filter(
            Mandi.id == mandi_id,
            Mandi.owner_id == owner_id,
            Mandi.is_active.is_(True),
        )
        .first()
    )


def update_mandi(
    db: Session,
    mandi_id: int,
    mandi_data: MandiCreate,
    owner_id: int,
) -> Mandi | None:
    db_mandi = get_owned_mandi(db, mandi_id, owner_id)

    if db_mandi is None:
        return None

    db_mandi.name = mandi_data.name
    db_mandi.location = mandi_data.location

    db.commit()
    db.refresh(db_mandi)

    return db_mandi


def deactivate_mandi(
    db: Session,
    mandi_id: int,
    owner_id: int,
) -> Mandi | None:
    db_mandi = get_owned_mandi(db, mandi_id, owner_id)

    if db_mandi is None:
        return None

    db_mandi.is_active = False

    db.commit()
    db.refresh(db_mandi)

    return db_mandi
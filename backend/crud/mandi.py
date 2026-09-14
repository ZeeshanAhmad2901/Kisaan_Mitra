from models.mandi import Mandi
from schemas.mandi import MandiCreate
from sqlalchemy.orm import Session


def create_mandi(db: Session, mandi: MandiCreate) -> Mandi:
    db_mandi = Mandi(
        name=mandi.name,
        location=mandi.location,
        owner_id=mandi.owner_id,
    )

    db.add(db_mandi)
    db.commit()
    db.refresh(db_mandi)

    return db_mandi


def get_all_mandis(db: Session) -> list[Mandi]:
    return db.query(Mandi).filter(Mandi.is_active.is_(True)).all()


def get_mandi_by_id(db: Session, mandi_id: int) -> Mandi | None:
    return (
        db.query(Mandi)
        .filter(Mandi.id == mandi_id, Mandi.is_active.is_(True))
        .first()
    )


def update_mandi(db: Session, mandi_id: int, mandi_data: MandiCreate) -> Mandi | None:
    db_mandi = get_mandi_by_id(db, mandi_id)

    if db_mandi is None:
        return None

    db_mandi.name = mandi_data.name
    db_mandi.location = mandi_data.location
    db_mandi.owner_id = mandi_data.owner_id

    db.commit()
    db.refresh(db_mandi)

    return db_mandi


def deactivate_mandi(db: Session, mandi_id: int) -> Mandi | None:
    db_mandi = get_mandi_by_id(db, mandi_id)

    if db_mandi is None:
        return None

    db_mandi.is_active = False

    db.commit()
    db.refresh(db_mandi)

    return db_mandi
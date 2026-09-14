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
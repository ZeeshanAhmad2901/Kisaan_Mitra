from collections import defaultdict
from datetime import datetime, timedelta

from auth.roles import require_role
from database.connection import engine
from fastapi import APIRouter, Depends
from models.booking import Booking
from models.mandi import Mandi
from models.procurement import Procurement
from models.user import User
from sqlalchemy import func
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@router.get("/platform-summary")
def get_platform_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("superAdmin")),
):
    total_mandis = (
        db.query(func.count(Mandi.id))
        .filter(Mandi.is_active.is_(True))
        .scalar()
        or 0
    )

    total_farmers = (
        db.query(func.count(User.id))
        .filter(
            User.role == "farmer",
            User.is_active.is_(True),
        )
        .scalar()
        or 0
    )

    total_mandi_owners = (
        db.query(func.count(User.id))
        .filter(
            User.role == "mandiOwner",
            User.is_active.is_(True),
        )
        .scalar()
        or 0
    )

    total_transactions = (
        db.query(func.count(Booking.id))
        .filter(Booking.status == "completed")
        .scalar()
        or 0
    )

    total_revenue = (
        db.query(func.coalesce(func.sum(Procurement.procurement_amount), 0))
        .filter(Procurement.payment_status == "paid")
        .scalar()
        or 0
    )

    active_today = (
        db.query(func.count(Booking.id))
        .filter(
            Booking.created_at >= datetime.utcnow() - timedelta(days=1)
        )
        .scalar()
        or 0
    )

    return {
        "totalMandis": total_mandis,
        "totalFarmers": total_farmers,
        "totalMandiOwners": total_mandi_owners,
        "totalTransactions": total_transactions,
        "totalRevenue": float(total_revenue),
        "activeToday": active_today,
    }


@router.get("/weekly")
def get_weekly_analytics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("superAdmin")),
):
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=6)

    rows = (
        db.query(
            func.date(Procurement.created_at).label("day"),
            func.coalesce(func.sum(Procurement.procurement_amount), 0).label(
                "revenue"
            ),
            func.count(Procurement.id).label("transactions"),
            func.count(func.distinct(Procurement.farmer_id)).label("farmers"),
        )
        .filter(
            Procurement.created_at >= datetime.combine(
                start_date,
                datetime.min.time(),
            )
        )
        .group_by(func.date(Procurement.created_at))
        .all()
    )

    data_by_day = {
        row.day: {
            "revenue": float(row.revenue or 0),
            "transactions": int(row.transactions or 0),
            "farmers": int(row.farmers or 0),
        }
        for row in rows
    }

    result = []

    for offset in range(7):
        day = start_date + timedelta(days=offset)
        values = data_by_day.get(
            day,
            {
                "revenue": 0,
                "transactions": 0,
                "farmers": 0,
            },
        )

        result.append(
            {
                "day": day.strftime("%a"),
                "date": day.isoformat(),
                **values,
            }
        )

    return result


@router.get("/monthly")
def get_monthly_analytics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("superAdmin")),
):
    today = datetime.utcnow().date()

    first_month = today.replace(day=1)

    rows = (
        db.query(
            func.year(Procurement.created_at).label("year"),
            func.month(Procurement.created_at).label("month"),
            func.coalesce(func.sum(Procurement.procurement_amount), 0).label(
                "revenue"
            ),
            func.count(Procurement.id).label("transactions"),
            func.count(func.distinct(Procurement.farmer_id)).label("farmers"),
        )
        .filter(
            Procurement.created_at >= datetime(
                today.year,
                1,
                1,
            )
        )
        .group_by(
            func.year(Procurement.created_at),
            func.month(Procurement.created_at),
        )
        .all()
    )

    data_by_month = {
        (int(row.year), int(row.month)): {
            "revenue": float(row.revenue or 0),
            "transactions": int(row.transactions or 0),
            "farmers": int(row.farmers or 0),
        }
        for row in rows
    }

    result = []

    for month in range(1, today.month + 1):
        values = data_by_month.get(
            (today.year, month),
            {
                "revenue": 0,
                "transactions": 0,
                "farmers": 0,
            },
        )

        month_date = datetime(today.year, month, 1)

        result.append(
            {
                "month": month_date.strftime("%b"),
                "year": today.year,
                **values,
            }
        )

    return result


@router.get("/mandi-revenue")
def get_mandi_revenue(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("superAdmin")),
):
    rows = (
        db.query(
            Mandi.id.label("mandi_id"),
            Mandi.name.label("mandi_name"),
            func.coalesce(
                func.sum(Procurement.procurement_amount),
                0,
            ).label("revenue"),
            func.count(func.distinct(Procurement.farmer_id)).label(
                "farmers"
            ),
            func.count(Procurement.id).label("transactions"),
        )
        .outerjoin(
            Procurement,
            Procurement.mandi_id == Mandi.id,
        )
        .filter(Mandi.is_active.is_(True))
        .group_by(Mandi.id, Mandi.name)
        .order_by(
            func.sum(Procurement.procurement_amount).desc()
        )
        .all()
    )

    return [
        {
            "mandi_id": row.mandi_id,
            "mandi_name": row.mandi_name,
            "revenue": float(row.revenue or 0),
            "farmers": int(row.farmers or 0),
            "transactions": int(row.transactions or 0),
        }
        for row in rows
    ]


@router.get("/crop-distribution")
def get_crop_distribution(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("superAdmin")),
):
    rows = (
        db.query(
            Procurement.crop_type.label("crop"),
            func.count(Procurement.id).label("transactions"),
            func.coalesce(
                func.sum(Procurement.procurement_amount),
                0,
            ).label("revenue"),
        )
        .group_by(Procurement.crop_type)
        .order_by(
            func.count(Procurement.id).desc()
        )
        .all()
    )

    total = sum(int(row.transactions or 0) for row in rows)

    return [
        {
            "crop": row.crop,
            "transactions": int(row.transactions or 0),
            "revenue": float(row.revenue or 0),
            "percentage": (
                round(
                    (int(row.transactions or 0) / total) * 100,
                    2,
                )
                if total
                else 0
            ),
        }
        for row in rows
    ]
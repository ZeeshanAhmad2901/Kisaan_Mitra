"""add booking arrival verification

Revision ID: ac718352e110
Revises: 48cdbde8b8cd
Create Date: 2026-09-19 09:08:00
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "ac718352e110"
down_revision: Union[str, Sequence[str], None] = "48cdbde8b8cd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "bookings",
        sa.Column(
            "arrival_status",
            sa.String(length=30),
            server_default="pending",
            nullable=False,
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "arrival_verified_at",
            sa.DateTime(),
            nullable=True,
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "arrival_verified_by",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.create_index(
        "ix_bookings_arrival_status",
        "bookings",
        ["arrival_status"],
    )

    op.create_index(
        "ix_bookings_arrival_verified_by",
        "bookings",
        ["arrival_verified_by"],
    )

    op.create_foreign_key(
        "fk_bookings_arrival_verified_by_users",
        "bookings",
        "users",
        ["arrival_verified_by"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_bookings_arrival_verified_by_users",
        "bookings",
        type_="foreignkey",
    )

    op.drop_index(
        "ix_bookings_arrival_verified_by",
        table_name="bookings",
    )

    op.drop_index(
        "ix_bookings_arrival_status",
        table_name="bookings",
    )

    op.drop_column("bookings", "arrival_verified_by")
    op.drop_column("bookings", "arrival_verified_at")
    op.drop_column("bookings", "arrival_status")
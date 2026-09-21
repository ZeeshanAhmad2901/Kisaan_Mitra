"""add booking source index

Revision ID: 0033c3813332
Revises: 94c78265d302
Create Date: 2026-09-19

"""

from typing import Sequence, Union

from alembic import op

revision: str = "0033c3813332"
down_revision: Union[str, Sequence[str], None] = "94c78265d302"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_bookings_booking_source",
        "bookings",
        ["booking_source"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_bookings_booking_source",
        table_name="bookings",
    )
"""add system settings

Revision ID: b61f8027b583
Revises: 4b8790c2e999
Create Date: 2026-09-19 11:50:50.477773

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "b61f8027b583"
down_revision: Union[str, Sequence[str], None] = "4b8790c2e999"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "system_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("platform_name", sa.String(length=100), nullable=False),
        sa.Column("support_email", sa.String(length=255), nullable=False),
        sa.Column("support_phone", sa.String(length=30), nullable=False),
        sa.Column(
            "max_bookings_per_farmer_per_day",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "booking_window_days",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "slot_duration_minutes",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "enable_farmer_registration",
            sa.Boolean(),
            nullable=False,
        ),
        sa.Column(
            "enable_mandi_owner_registration",
            sa.Boolean(),
            nullable=False,
        ),
        sa.Column(
            "require_aadhaar_verification",
            sa.Boolean(),
            nullable=False,
        ),
        sa.Column(
            "enable_sms_notifications",
            sa.Boolean(),
            nullable=False,
        ),
        sa.Column(
            "maintenance_mode",
            sa.Boolean(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("system_settings")
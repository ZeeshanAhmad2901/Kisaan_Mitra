"""add booking source

Revision ID: 98b7f783b643
Revises: fd8b01580ef7
Create Date: 2026-09-17 22:17:04.786607

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '98b7f783b643'
down_revision: Union[str, Sequence[str], None] = 'fd8b01580ef7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'bookings',
        sa.Column(
            'booking_source',
            sa.String(length=20),
            nullable=False,
            server_default='self',
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('bookings', 'booking_source')
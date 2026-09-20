"""add booking arrival verification

Revision ID: c6f445413966
Revises: 48cdbde8b8cd
Create Date: 2026-09-19 09:07:04.725202

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c6f445413966'
down_revision: Union[str, Sequence[str], None] = '48cdbde8b8cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

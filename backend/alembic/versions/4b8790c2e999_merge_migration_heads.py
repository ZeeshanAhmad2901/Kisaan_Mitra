"""merge migration heads

Revision ID: 4b8790c2e999
Revises: ac718352e110, c6f445413966
Create Date: 2026-09-19 09:09:45.228482

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4b8790c2e999'
down_revision: Union[str, Sequence[str], None] = ('ac718352e110', 'c6f445413966')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

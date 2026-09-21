"""add mandi assignment to users

Revision ID: 48cdbde8b8cd
Revises: 4ca20af8f718
Create Date: 2026-09-18 17:53:54.038066

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '48cdbde8b8cd'
down_revision: Union[str, Sequence[str], None] = '4ca20af8f718'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'users',
        sa.Column('mandi_id', sa.Integer(), nullable=True),
    )
    op.create_index(
        op.f('ix_users_mandi_id'),
        'users',
        ['mandi_id'],
        unique=False,
    )
    op.create_foreign_key(
        'fk_users_mandi_id_mandis',
        'users',
        'mandis',
        ['mandi_id'],
        ['id'],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(
        'fk_users_mandi_id_mandis',
        'users',
        type_='foreignkey',
    )
    op.drop_index(
        op.f('ix_users_mandi_id'),
        table_name='users',
    )
    op.drop_column('users', 'mandi_id')

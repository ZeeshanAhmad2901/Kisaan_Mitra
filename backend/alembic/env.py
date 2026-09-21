from logging.config import fileConfig

from alembic import context
from database.connection import engine
from models.audit_log import AuditLog  # noqa: F401
from models.base import Base
from models.booking import Booking  # noqa: F401
from models.crop_price import CropPrice  # noqa: F401
from models.login_attempt import LoginAttempt  # noqa: F401
from models.mandi import Mandi  # noqa: F401
from models.notification import Notification  # noqa: F401
from models.procurement import Procurement  # noqa: F401
from models.slot import Slot  # noqa: F401
from models.system_setting import SystemSetting  # noqa: F401
from models.transport_request import TransportRequest  # noqa: F401
from models.user import User  # noqa: F401
from models.vehicle import Vehicle  # noqa: F401
from sqlalchemy import pool

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=str(engine.url),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

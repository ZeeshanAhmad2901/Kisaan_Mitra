from sqlalchemy import URL, create_engine

from config import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER

database_url = URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME,
)

engine = create_engine(
    database_url,
    echo=True,
)
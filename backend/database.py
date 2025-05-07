from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DB_URL = "sqlite:///mydatabase.db"

engine = create_engine(DB_URL)

Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()
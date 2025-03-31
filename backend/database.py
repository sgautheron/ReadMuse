from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# chemin vers la base de données SQLite
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{BASE_DIR}/../data/bdd_readmuse.db"

# Création du moteur de base de données
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Session pour interagir avec la base de données
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Modèle de base pour SQLAlchemy
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

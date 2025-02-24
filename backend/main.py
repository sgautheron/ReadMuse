from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware  # Import du middleware CORS
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend.models import Base, Livre
from typing import List

# Création des tables si elles n'existent pas
Base.metadata.create_all(bind=engine)

# Initialisation de FastAPI
app = FastAPI()

# ✅ Activation du CORS pour autoriser le frontend React (http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Autorise uniquement ton frontend
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les headers
)

# Dépendance pour récupérer une session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Route pour récupérer les livres en base
@app.get("/livres/", response_model=List[dict])
def get_livres(db: Session = Depends(get_db)):  
    livres = db.query(Livre).all()
    return [
        {
            "ID_Livre": b.ID_Livre,
            "Titre": b.Titre,
            "Auteur": b.Auteur,
            "Genre": b.Genre,
            "Mots_Cles": b.Mots_Cles,
            "Resume": b.Resume,
            "Date_Publication": b.Date_Publication,
            "Editeur": b.Editeur,
            "Nombre_Pages": b.Nombre_Pages,
            "URL_Couverture": b.URL_Couverture
        } 
        for b in livres
    ]

# Route d'accueil
@app.get("/")
def home():
    return {"message": "Bienvenue sur l'API ReadMuse !"}

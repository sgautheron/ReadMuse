from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Import du middleware CORS
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend.models import Base, Livre
from typing import List

# Création des tables si elles n'existent pas
Base.metadata.create_all(bind=engine)

# Initialisation de FastAPI
app = FastAPI()

# 🔥 Autoriser toutes les origines (à changer en prod !)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⛔ Mieux de mettre ["http://localhost:5174"] pour la sécurité
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dépendance pour récupérer une session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Route pour récupérer TOUS les livres
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

# ✅ Route pour récupérer UN livre par ID
@app.get("/livres/{id}", response_model=dict)
def get_livre(id: int, db: Session = Depends(get_db)):
    livre = db.query(Livre).filter(Livre.ID_Livre == id).first()
    
    if not livre:
        raise HTTPException(status_code=404, detail="Livre non trouvé")

    return {
        "ID_Livre": livre.ID_Livre,
        "Titre": livre.Titre,
        "Auteur": livre.Auteur,
        "Genre": livre.Genre,
        "Mots_Cles": livre.Mots_Cles,
        "Resume": livre.Resume,
        "Date_Publication": livre.Date_Publication,
        "Editeur": livre.Editeur,
        "Nombre_Pages": livre.Nombre_Pages,
        "URL_Couverture": livre.URL_Couverture
    }

# ✅ Route d'accueil
@app.get("/")
def home():
    return {"message": "Bienvenue sur l'API ReadMuse !"}

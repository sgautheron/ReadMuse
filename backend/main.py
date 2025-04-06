from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, get_db
from backend.models import Base, Livre, Interaction, Utilisateur
from backend.schemas import InteractionCreate, InteractionOut, Description, ReviewOut
from backend.auth import auth_router
from backend.recommendation import recommander_livres
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import sqlite3

# ✅ Initialisation de l'app FastAPI
app = FastAPI()

# ✅ Middleware CORS
app.add_middleware(
    CORSMiddleware,
allow_origins=["*"]

)

# ✅ Création des tables si nécessaire
Base.metadata.create_all(bind=engine)

# ✅ Inclusion des routes d'auth
app.include_router(auth_router)


# ✅ Route pour récupérer tous les livres
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




class InteractionCreate(BaseModel):
    ID_Utilisateur: int = Field(..., alias="ID_Utilisateur")
    ID_Livre: int = Field(..., alias="ID_Livre")
    Note: Optional[int] = None 
    Description: str = Field(..., alias="Description")

    class Config:
        allow_population_by_field_name = True

# ✅ Route pour enregistrer une interaction
@app.post("/interactions/")
def create_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    new_interaction = Interaction(
        ID_Utilisateur=interaction.ID_Utilisateur,
        ID_Livre=interaction.ID_Livre,
        Note=interaction.Note,
        Date_Interaction=datetime.now(),
        Description=interaction.Description,
    )
    db.add(new_interaction)
    db.commit()
    db.refresh(new_interaction)
    return {"message": "Interaction enregistrée avec succès", "id": new_interaction.ID_Interaction}



@app.get("/interactions/{id_utilisateur}", response_model=List[InteractionOut])
def get_interactions_by_user(id_utilisateur: int, db: Session = Depends(get_db)):
    interactions = (
        db.query(Interaction.ID_Interaction, Livre.Titre, Interaction.Description, Interaction.Date_Interaction)
        .join(Livre, Livre.ID_Livre == Interaction.ID_Livre)
        .filter(Interaction.ID_Utilisateur == id_utilisateur)
        .order_by(Interaction.Date_Interaction.desc())
        .all()
    )

    if not interactions:
        return []  # ou lève une exception si tu préfères

    return interactions


@app.get("/livres/{id}/reviews", response_model=List[ReviewOut])
def get_reviews_by_book(id: int, db: Session = Depends(get_db)):
    print(f"📥 Requête reçue pour les reviews du livre {id}")
    reviews = (
        db.query(Interaction.Description, Interaction.Date_Interaction, Utilisateur.Nom)
        .join(Utilisateur, Utilisateur.ID_Utilisateur == Interaction.ID_Utilisateur)
        .filter(Interaction.ID_Livre == id)
        .order_by(Interaction.Date_Interaction.desc())
        .all()
    )

    return [
        {
            "utilisateur": r.Nom,
            "commentaire": r.Description,
            "date": r.Date_Interaction.date()  # ✅ ici !!
        }
        for r in reviews
    ]


# ✅ Route d'accueil
@app.get("/")
def home():
    return {"message": "Bienvenue sur l'API ReadMuse !"}


@app.get("/livres/par_categorie")
def get_livres_par_categorie():
    conn = sqlite3.connect("data/bdd_readmuse.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Livres")
    livres = cursor.fetchall()

    # Regroupe les livres par catégorie
    categories = {}
    for livre in livres:
        categorie = livre[11] if livre[11] else "Autres"  # Index de ta colonne Catégorie
        if categorie not in categories:
            categories[categorie] = []
        categories[categorie].append({
            "ID_Livre": livre[0],
            "Titre": livre[1],
            "Auteur": livre[2],
            "Genre": livre[3],
            "Genre": livre[4],
            "Resume": livre[5],
            "Date_Publication": livre[6],
            "Editeur": livre[7],
            "Nombre_Pages": livre[8],
            "URL_Couverture": livre[9],
            "ISBN": livre[10]
        })

    conn.close()
    return categories


@app.get("/livres/populaires")
def get_livres_par_popularite():
    conn = sqlite3.connect("data/bdd_readmuse.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM LivresParPopularite")
    livres = cursor.fetchall()

    conn.close()
    return [dict(livre) for livre in livres]


# ✅ Route pour récupérer les avis (reviews) d’un livre AVANT la route /livres/{id}
@app.get("/livres/{id}/reviews", response_model=List[ReviewOut])
def get_reviews_by_book(id: int, db: Session = Depends(get_db)):
    print(f"📥 Requête reçue pour les reviews du livre {id}")
    reviews = (
        db.query(Interaction.Description, Interaction.Date_Interaction, Utilisateur.Nom)
        .join(Utilisateur, Utilisateur.ID_Utilisateur == Interaction.ID_Utilisateur)
        .filter(Interaction.ID_Livre == id)
        .order_by(Interaction.Date_Interaction.desc())
        .all()
    )
    return [
        {
            "utilisateur": r.Nom,
            "commentaire": r.Description,
            "date": r.Date_Interaction.date()  # ✅ Conversion ici
        }
        for r in reviews
    ]


# Route pour récupérer un livre par ID
@app.get("/livres/{id}", response_model=dict)
def get_livre(id: int, db: Session = Depends(get_db)):
    livre = db.query(Livre).filter(Livre.ID_Livre == id).first()
    
    if not livre:
        raise HTTPException(status_code=404, detail="Livre non trouvé")

    livre_dict = {
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
    
    print(f"📢 Données envoyées par l'API pour ID {id}:", livre_dict)
    
    return livre_dict



class Description(BaseModel):
    texte: str



@app.post("/api/recommander")
def recommander(description: Description, db: Session = Depends(get_db)):
    recommandations = recommander_livres(description.texte, db)
    return {"recommandations": recommandations}



@app.get("/livres/motcle/{tag}", response_model=List[dict])
def get_livres_par_mot_cle(tag: str, db: Session = Depends(get_db)):
    tag = tag.strip().lower()
    livres = db.query(Livre).filter(Livre.Mots_Cles.ilike(f"%{tag}%")).all()

    if not livres:
        raise HTTPException(status_code=404, detail="Aucun livre trouvé pour ce mot-clé.")

    return [
        {
            "ID_Livre": livre.ID_Livre,
            "Titre": livre.Titre,
            "Auteur": livre.Auteur,
            "URL_Couverture": livre.URL_Couverture,
            "Mots_Cles": livre.Mots_Cles,
        }
        for livre in livres
    ]


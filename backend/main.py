from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, get_db
from backend.models import Base, Livre, Interaction, Utilisateur, Favori
from backend.schemas import InteractionCreate, InteractionOut, Description, ReviewOut
from backend.auth import auth_router
from backend.recommendation import recommander_livres
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import sqlite3
from backend.utils import generer_profil_litteraire
from collections import Counter
import spacy
from sqlalchemy import text

nlp = spacy.load("fr_core_news_sm")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(auth_router)

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
    ID_Utilisateur: int = Field(...)
    ID_Livre: int = Field(...)
    Note: Optional[int] = None
    Description: str = Field(...)

    class Config:
        allow_population_by_field_name = True

class DescriptionUtilisateur(BaseModel):
    texte: str

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
    return interactions

@app.get("/livres/{id}/reviews", response_model=List[ReviewOut])
def get_reviews_by_book(id: int, db: Session = Depends(get_db)):
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
            "date": r.Date_Interaction.date()
        }
        for r in reviews
    ]

@app.get("/")
def home():
    return {"message": "Bienvenue sur l'API ReadMuse !"}

@app.get("/livres/par_categorie")
def get_livres_par_categorie():
    conn = sqlite3.connect("data/bdd_readmuse.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Livres")
    livres = cursor.fetchall()

    categories = {}
    for livre in livres:
        categorie = livre[11] if livre[11] else "Autres"
        if categorie not in categories:
            categories[categorie] = []
        categories[categorie].append({
            "ID_Livre": livre[0],
            "Titre": livre[1],
            "Auteur": livre[2],
            "Genre": livre[3],
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

@app.post("/api/recommander")
def recommander(description: Description, db: Session = Depends(get_db)):
    recommandations = recommander_livres(description.texte, db)
    return {"recommandations": recommandations}

from sqlalchemy import text
import unicodedata

def normaliser_texte(txt):
    txt = unicodedata.normalize('NFD', txt)
    txt = ''.join(c for c in txt if unicodedata.category(c) != 'Mn')
    txt = ''.join(c for c in txt if c.isalpha() or c.isspace() or c == "-")
    return txt.strip().lower()


@app.get("/livres/motcle/{mot}")
def get_livres_depuis_descriptions(mot: str, db: Session = Depends(get_db)):
    mot_normalise = normaliser_texte(mot)
    livres_trouves = {}

    interactions = db.query(Interaction).all()

    for interaction in interactions:
        if interaction.Description:
            doc = nlp(interaction.Description.lower())
            lemmas = [token.lemma_.lower() for token in doc if token.is_alpha]

            if mot_normalise in lemmas:
                livre = db.query(Livre).filter(Livre.ID_Livre == interaction.ID_Livre).first()
                if livre and livre.ID_Livre not in livres_trouves:
                    livres_trouves[livre.ID_Livre] = livre

    return {
        "mot": mot,
        "nb_livres": len(livres_trouves),
        "livres": [
            {
                "ID_Livre": l.ID_Livre,
                "Titre": l.Titre,
                "Auteur": l.Auteur,
                "URL_Couverture": l.URL_Couverture,
            }
            for l in livres_trouves.values()
        ],
    }



@app.get("/motcles_populaires")
def get_motcles_populaires(db: Session = Depends(get_db)):
    from backend.recommendation import stopwords_personnalises
    descriptions = [interaction.Description for interaction in db.query(Interaction).all()]
    mots = []
    for desc in descriptions:
        doc = nlp(desc.lower())
        mots += [
            token.lemma_.lower()
            for token in doc
            if token.is_alpha and not token.is_stop and token.lemma_.lower() not in stopwords_personnalises
        ]
    compte = Counter(mots)
    compte_filtré = {mot: freq for mot, freq in compte.items() if freq >= 3}
    mots_cles = sorted(
        [{"mot": mot, "nb_livres": freq} for mot, freq in compte_filtré.items()],
        key=lambda x: x["nb_livres"],
        reverse=True,
    )
    return mots_cles

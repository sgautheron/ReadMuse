from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import sqlite3
import spacy
import unicodedata
from datetime import datetime
from collections import defaultdict, Counter
from typing import List, Optional

from backend.database import SessionLocal, engine, get_db
from backend.models import Base, Livre, Interaction, Utilisateur, Favori
from backend.schemas import InteractionCreate, InteractionOut, Description, ReviewOut
from backend.auth import auth_router
from backend.recommendation import recommander_livres, stopwords_personnalises
from backend.utils import generer_profil_litteraire
from backend.models import Cercle, Utilisateur


# Chargement NLP
nlp = spacy.load("fr_core_news_sm")

# Initialisation app FastAPI
app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Création des tables
Base.metadata.create_all(bind=engine)

# Authentification
app.include_router(auth_router)

# Accueil
@app.get("/")
def home():
    return {"message": "Bienvenue sur l'API ReadMuse !"}


# ------------------------
# 📚 Gestion des livres
# ------------------------

@app.get("/livres/", response_model=List[dict])
def get_livres(db: Session = Depends(get_db)):
    livres = db.query(Livre).all()
    return [
        {
            "ID_Livre": l.ID_Livre,
            "Titre": l.Titre,
            "Auteur": l.Auteur,
            "Genre": l.Genre,
            "Mots_Cles": l.Mots_Cles,
            "Resume": l.Resume,
            "Date_Publication": l.Date_Publication,
            "Editeur": l.Editeur,
            "Nombre_Pages": l.Nombre_Pages,
            "URL_Couverture": l.URL_Couverture
        }
        for l in livres
    ]

@app.get("/livres/{id}", response_model=dict)
def get_livre(id: int, db: Session = Depends(get_db)):
    livre = db.query(Livre).filter(Livre.ID_Livre == id).first()
    if not livre:
        raise HTTPException(status_code=404, detail="Livre non trouvé")

    # 🔍 Récupération des descriptions pour ce livre
    interactions = (
        db.query(Interaction.Description)
        .filter(Interaction.ID_Livre == id)
        .all()
    )

    # NLP sur les descriptions
    texte_total = " ".join([i.Description for i in interactions if i.Description])
    doc = nlp(texte_total.lower())
    mots = [
        token.lemma_.lower()
        for token in doc
        if token.is_alpha and not token.is_stop and token.lemma_.lower() not in stopwords_personnalises
    ]

    # Compter et garder les 10 mots les plus fréquents
    compte = Counter(mots)
    mots_cles_analyses = [mot for mot, freq in compte.most_common(10)]

    return {
        "ID_Livre": livre.ID_Livre,
        "Titre": livre.Titre,
        "Auteur": livre.Auteur,
        "Genre": livre.Genre,
        "Mots_Cles": livre.Mots_Cles,
        "Mots_Cles_Analytiques": mots_cles_analyses,
        "Resume": livre.Resume,
        "Date_Publication": livre.Date_Publication,
        "Editeur": livre.Editeur,
        "Nombre_Pages": livre.Nombre_Pages,
        "URL_Couverture": livre.URL_Couverture
    }


@app.get("/livres/par_categorie")
def get_livres_par_categorie():
    conn = sqlite3.connect("data/bdd_readmuse.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Livres")
    livres = cursor.fetchall()

    categories = {}
    for livre in livres:
        categorie = livre[11] if livre[11] else "Autres"
        categories.setdefault(categorie, []).append({
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


# ------------------------
# ✏️ Interactions utilisateur
# ------------------------

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
        db.query(Interaction.Description, Interaction.Date_Interaction, Utilisateur.ID_Utilisateur, Utilisateur.Nom)
        .join(Utilisateur, Utilisateur.ID_Utilisateur == Interaction.ID_Utilisateur)
        .filter(Interaction.ID_Livre == id)
        .order_by(Interaction.Date_Interaction.desc())
        .all()
    )
    return [
        {
            "utilisateur_id": r.ID_Utilisateur,
            "utilisateur": r.Nom,
            "commentaire": r.Description,
            "date": r.Date_Interaction.date()
        }
        for r in reviews
    ]


# ------------------------
# 🤖 Recommandation
# ------------------------

@app.post("/api/recommander")
def recommander(description: Description, db: Session = Depends(get_db)):
    recommandations = recommander_livres(description.texte, db)
    return {"recommandations": recommandations}


# ------------------------
# 🔍 Exploration mots-clés
# ------------------------

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
        "livres": [{
            "ID_Livre": l.ID_Livre,
            "Titre": l.Titre,
            "Auteur": l.Auteur,
            "URL_Couverture": l.URL_Couverture,
        } for l in livres_trouves.values()]
    }

@app.get("/livres/{id}/motcles_avis")
def get_mots_cles_par_livre(id: int, db: Session = Depends(get_db)):
    # Récupération des descriptions associées à ce livre
    interactions = (
        db.query(Interaction.Description)
        .filter(Interaction.ID_Livre == id)
        .all()
    )

    # Nettoyage des descriptions (ignore les None et les vides)
    descriptions = [i.Description.strip() for i in interactions if i.Description and i.Description.strip()]

    # Concaténation du texte
    texte_total = " ".join(descriptions)

    # Logging côté terminal/console
    print(f"[DEBUG] Livre ID {id} : {len(descriptions)} descriptions analysées")
    print(f"[DEBUG] Texte concaténé : {texte_total[:300]}...")  # pour éviter d’afficher tout un pavé

    # Analyse NLP
    doc = nlp(texte_total.lower())
    mots = [
        token.lemma_.lower()
        for token in doc
        if token.is_alpha
        and not token.is_stop
        and token.lemma_.lower() not in stopwords_personnalises
    ]

    compte = Counter(mots)
    mots_cles = [mot for mot, freq in compte.most_common(10)]

    return {
        "motcles": mots_cles,
        "nb_descriptions": len(descriptions),
        "texte_total_extrait": texte_total[:300],  # pour vérif rapide
        "descriptions": descriptions
    }

    


@app.get("/motcles_populaires")
def get_motcles_populaires(db: Session = Depends(get_db)):
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


# ------------------------
# 🌈 Exploration émotionnelle
# ------------------------

CATEGORIES_EMOTIONNELLES = {
    "Pour pleurer un bon coup 😢": ["triste", "émouvant", "larmes", "deuil", "solitude"],
    "Suspense haletant 🔥": ["suspense", "tension", "haletant", "thriller", "angoissant"],
    "Écriture poétique ✨": ["poétique", "beau", "lyrique", "métaphore", "élégant"],
    "Personnages torturés 🥀": ["complexe", "psychologique", "intense", "dérangeant"],
    "Univers immersifs 🌍": ["magique", "imaginaire", "fascinant", "monde", "univers"],
    "Histoire d’amour ❤️": ["amour", "romantique", "relation", "cœur", "sentiments"]
}

@app.get("/exploration_emo")
def get_categories_emotionnelles(db: Session = Depends(get_db)):
    interactions = db.query(Interaction).all()
    categorie_to_livres = defaultdict(set)

    for interaction in interactions:
        doc = nlp(interaction.Description.lower())
        lemmes = [token.lemma_ for token in doc if token.is_alpha]

        for categorie, mots in CATEGORIES_EMOTIONNELLES.items():
            if any(mot in lemmes for mot in mots):
                categorie_to_livres[categorie].add(interaction.ID_Livre)

    categories = []
    for categorie, livres_ids in categorie_to_livres.items():
        livres = db.query(Livre).filter(Livre.ID_Livre.in_(livres_ids)).limit(20).all()
        categories.append({
            "categorie": categorie,
            "nb_livres": len(livres),
            "livres": [{
                "ID_Livre": l.ID_Livre,
                "Titre": l.Titre,
                "Auteur": l.Auteur,
                "URL_Couverture": l.URL_Couverture,
            } for l in livres]
        })

    return categories




@app.post("/favoris/")
def ajouter_favori(id_utilisateur: int, id_livre: int, db: Session = Depends(get_db)):
    favori = Favori(ID_Utilisateur=id_utilisateur, ID_Livre=id_livre)
    db.add(favori)
    db.commit()
    return {"message": "Ajouté aux favoris"}

@app.get("/favoris/{id_utilisateur}", response_model=List[dict])
def get_favoris(id_utilisateur: int, db: Session = Depends(get_db)):
    favoris = (
        db.query(Favori, Livre)
        .join(Livre, Favori.ID_Livre == Livre.ID_Livre)
        .filter(Favori.ID_Utilisateur == id_utilisateur)
        .all()
    )
    return [
        {
            "ID_Livre": livre.ID_Livre,
            "Titre": livre.Titre,
            "Auteur": livre.Auteur,
            "URL_Couverture": livre.URL_Couverture,
        }
        for _, livre in favoris
    ]

@app.delete("/favoris/{id_utilisateur}/{id_livre}")
def supprimer_favori(id_utilisateur: int, id_livre: int, db: Session = Depends(get_db)):
    favori = (
        db.query(Favori)
        .filter(Favori.ID_Utilisateur == id_utilisateur, Favori.ID_Livre == id_livre)
        .first()
    )
    if not favori:
        raise HTTPException(status_code=404, detail="Favori non trouvé")
    db.delete(favori)
    db.commit()
    return {"message": "Retiré des favoris"}

@app.get("/utilisateurs/{id_utilisateur}/stats")
def get_stats_utilisateur(id_utilisateur: int, db: Session = Depends(get_db)):
    from sqlalchemy import func
    total_interactions = db.query(func.count()).filter(Interaction.ID_Utilisateur == id_utilisateur).scalar()
    livres_distincts = db.query(func.count(func.distinct(Interaction.ID_Livre))).filter(Interaction.ID_Utilisateur == id_utilisateur).scalar()
    return {
        "total_interactions": total_interactions,
        "livres_distincts": livres_distincts,
    }

@app.get("/utilisateurs/{id_utilisateur}/profil_ia")
def get_profil_litteraire(id_utilisateur: int, db: Session = Depends(get_db)):
    interactions = (
        db.query(Interaction.Description)
        .filter(Interaction.ID_Utilisateur == id_utilisateur)
        .all()
    )
    descriptions = [desc.Description for desc in interactions]

    if not descriptions:
        raise HTTPException(status_code=404, detail="Pas assez de données pour générer un profil littéraire.")

    return {"profil": generer_profil_litteraire(descriptions)}



@app.get("/utilisateurs/{id_utilisateur}/profil_emotionnel")
def get_profil_emotionnel(id_utilisateur: int, db: Session = Depends(get_db)):
    interactions = (
        db.query(Interaction.Description)
        .filter(Interaction.ID_Utilisateur == id_utilisateur)
        .all()
    )
    descriptions = [desc.Description for desc in interactions if desc.Description]

    if not descriptions:
        raise HTTPException(status_code=404, detail="Pas assez de descriptions pour générer un profil émotionnel.")

    texte_total = " ".join(descriptions)
    doc = nlp(texte_total.lower())

    # Extraire les mots clés émotionnels
    lemmes = [
        token.lemma_.lower()
        for token in doc
        if token.is_alpha and not token.is_stop and token.lemma_.lower() not in stopwords_personnalises
    ]
    compte = Counter(lemmes)
    top_mots = [mot for mot, freq in compte.most_common(15)]

    return {
        "id_utilisateur": id_utilisateur,
        "mots_cles_emotionnels": top_mots
    }
@app.get("/utilisateurs/{id_utilisateur}/compatibilite_emotionnelle/{autre_id}")
def get_compatibilite_emotionnelle(id_utilisateur: int, autre_id: int, db: Session = Depends(get_db)):
    def extraire_top_mots(uid: int, top_n=15):
        interactions = db.query(Interaction.Description).filter(Interaction.ID_Utilisateur == uid).all()
        texte_total = " ".join([i.Description for i in interactions if i.Description])
        doc = nlp(texte_total.lower())

        lemmes = [
            token.lemma_.lower()
            for token in doc
            if token.is_alpha and not token.is_stop and token.lemma_.lower() not in stopwords_personnalises
        ]
        compte = Counter(lemmes)
        return [mot for mot, freq in compte.most_common(top_n)]

    top_1 = set(extraire_top_mots(id_utilisateur))
    top_2 = set(extraire_top_mots(autre_id))

    if not top_1 or not top_2:
        return {"compatibilite_emotionnelle": 0, "mots_commun": []}

    intersection = top_1 & top_2
    union = top_1 | top_2
    ratio = len(intersection) / len(union)
    score = round((ratio ** 0.5) * 100)

    return {
        "compatibilite_emotionnelle": score,
        "mots_commun": list(intersection)
    }


@app.post("/cercle/{id_utilisateur}/ajouter/{id_membre}")
def ajouter_au_cercle(id_utilisateur: int, id_membre: int, db: Session = Depends(get_db)):
    if id_utilisateur == id_membre:
        raise HTTPException(status_code=400, detail="Impossible de s’ajouter soi-même.")

    deja = db.query(Cercle).filter_by(ID_Utilisateur=id_utilisateur, ID_Membre=id_membre).first()
    if deja:
        raise HTTPException(status_code=400, detail="Déjà dans le cercle.")

    lien = Cercle(ID_Utilisateur=id_utilisateur, ID_Membre=id_membre)
    db.add(lien)
    db.commit()
    return {"message": "Ajouté au cercle avec succès."}


@app.get("/cercle/{id_utilisateur}")
def get_cercle(id_utilisateur: int, db: Session = Depends(get_db)):
    membres = (
        db.query(Utilisateur)
        .join(Cercle, Cercle.ID_Membre == Utilisateur.ID_Utilisateur)
        .filter(Cercle.ID_Utilisateur == id_utilisateur)
        .all()
    )
    return [
        {"id": m.ID_Utilisateur, "nom": m.Nom, "mail": m.Mail}
        for m in membres
    ]


@app.delete("/cercle/{id_utilisateur}/retirer/{id_membre}")
def retirer_du_cercle(id_utilisateur: int, id_membre: int, db: Session = Depends(get_db)):
    lien = db.query(Cercle).filter_by(ID_Utilisateur=id_utilisateur, ID_Membre=id_membre).first()
    if not lien:
        raise HTTPException(status_code=404, detail="Lien non trouvé.")

    db.delete(lien)
    db.commit()
    return {"message": "Retiré du cercle."}


@app.get("/cercle/{id_utilisateur}")
def get_cercle(id_utilisateur: int, db: Session = Depends(get_db)):
    membres = (
        db.query(Utilisateur)
        .join(Cercle, Cercle.ID_Membre == Utilisateur.ID_Utilisateur)
        .filter(Cercle.ID_Utilisateur == id_utilisateur)
        .all()
    )

    return [
        {
            "id": membre.ID_Utilisateur,
            "nom": membre.Nom,
            "email": membre.Email
        }
        for membre in membres
    ]
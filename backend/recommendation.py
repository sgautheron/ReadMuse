import spacy
from sqlalchemy.orm import Session
from backend.models import Livre
from backend.themes import themes

# Chargement NLP
nlp = spacy.load("fr_core_news_sm")

# Ensemble des thèmes (utilisés pour validation uniquement, pas comme mots-clés)
themes_importants = set(themes.keys())

def nettoyer_description(texte):
    doc = nlp(texte.lower())
    return [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]

def trouver_theme(mot, themes):
    for theme, liste in themes.items():
        if mot in liste:
            return theme
    return None

def regrouper_par_theme(mots, themes):
    regroupement = {}
    for mot in mots:
        theme = trouver_theme(mot, themes)
        if theme:
            regroupement.setdefault(theme, []).append(mot)
    return regroupement

def recommander_livres(description_utilisateur: str, db: Session):
    mots_utiles = set(nettoyer_description(description_utilisateur))

    livres = db.query(Livre).all()
    recommandations = []

    for livre in livres:
        elements = []

        if livre.Genre:
            elements.append(livre.Genre.lower())

        if livre.Mots_Cles:
            elements += [mot.strip().lower() for mot in livre.Mots_Cles.split(",")]

        mots_partages = set(elements) & mots_utiles
        if not mots_partages:
            continue

        themes_groupés = regrouper_par_theme(mots_partages, themes)

        mots_significatifs = [
            mot for mot in mots_partages
            if trouver_theme(mot, themes) in themes_importants
        ]

        score = len(mots_significatifs)

        if score > 0:
            recommandations.append({
                "id": livre.ID_Livre,
                "titre": livre.Titre,
                "score": score,
                "themes_partagés": themes_groupés
            })

            print(f"📘 {livre.Titre} → ✅ score: {score}")
            for theme, mots in themes_groupés.items():
                print(f"   • {theme} : {', '.join(mots)}")

    recommandations.sort(key=lambda x: x["score"], reverse=True)
    return recommandations

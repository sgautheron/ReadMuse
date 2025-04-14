from collections import Counter
from backend.database import SessionLocal
from backend.models import Livre, Interaction
from backend.themes import themes
import spacy

# ✅ Tous les thèmes sont pris en compte
themes_importants = set(themes.keys())

# ✅ Chargement du modèle spaCy
nlp = spacy.load("fr_core_news_sm")

def nettoyer_texte(texte):
    doc = nlp(texte.lower())
    return [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]

def detecter_themes_pondérés(mots, themes):
    compteur = Counter()
    for mot in mots:
        for theme, liste in themes.items():
            if mot in liste:
                compteur[mot] += 1
    return compteur

# ✅ Connexion à la BDD
db = SessionLocal()
livres = db.query(Livre).all()

print("🔎 Nombre de livres :", len(livres))
livres_modifiés = 0

for livre in livres:
    interactions = db.query(Interaction).filter(Interaction.ID_Livre == livre.ID_Livre).all()
    if not interactions:
        continue

    corpus = " ".join([i.Description for i in interactions if i.Description])
    if not corpus.strip():
        continue

    mots = nettoyer_texte(corpus)
    mots_cles_pondérés = detecter_themes_pondérés(mots, themes)

    if mots_cles_pondérés:
        mots_final = [mot for mot, count in mots_cles_pondérés.most_common(10)]
        chaine_mots = ", ".join(mots_final)
        livre.Mots_Cles = chaine_mots
        print(f"📘 {livre.Titre} ({livre.ID_Livre}) → {chaine_mots}")
        livres_modifiés += 1

db.commit()
db.close()
print(f"Mots-clés mis à jour pour {livres_modifiés} livres.")

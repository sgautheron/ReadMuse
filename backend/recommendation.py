import spacy
nlp = spacy.load("fr_core_news_sm")
from backend.themes import themes


def recommander_livres(description_utilisateur, conn):
    from backend.themes import themes

    mots = nettoyer_description(description_utilisateur)
    themes_user = detecter_themes(mots, themes)

    livres = conn.execute("SELECT id, titre, themes FROM Livres").fetchall()
    recommandations = []

    for livre in livres:
        id_, titre, themes_livre = livre
        if not themes_livre:
            continue
        themes_livre = [t.strip() for t in themes_livre.split(",")]
        score = len(set(themes_livre).intersection(themes_user))
        if score > 0:
            recommandations.append({
                "id": id_,
                "titre": titre,
                "score": score,
                "themes_partagés": list(set(themes_livre) & set(themes_user))
            })

    recommandations.sort(key=lambda x: x["score"], reverse=True)
    return recommandations

def nettoyer_description(texte):
    doc = nlp(texte.lower())
    return [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]


def detecter_themes(mots_utiles, themes):
    themes_detectes = set()
    for theme, mots_clefs in themes.items():
        for mot in mots_utiles:
            if mot in mots_clefs:
                themes_detectes.add(theme)
    return list(themes_detectes)

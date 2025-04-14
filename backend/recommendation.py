import spacy
from typing import Optional
from sqlalchemy.orm import Session
from backend.models import Livre, Interaction
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Chargement du modèle SpaCy français
nlp = spacy.load("fr_core_news_sm")

# Stopwords personnalisés à exclure (trop vagues ou trop fréquents)
stopwords_personnalises = {
    "livre", "adorer", "lecture", "histoire", "roman", "personnage", "aimer", "bouquin", "lu",
    "ambiance", "univers", "intrigue", "plu", "plaire", "thème", "récit", "parle", "sujet",
    "écriture", "style", "rythme", "fin", "grand", "beaucoup", "très", "vraiment",
    "tome", "univer", "devenir", "auteur", "presque", "constant", "point", "vue", "ressentir", 
    "vrai", "final", "conclusion", "trop", "préférer", "passage", "trouver", "renforcer", "bien",
    "bon", "beau", "bout", "moment", "petit", "scène", "parfaire", "compte", "the", "contre", 
    "texte", "contre", "dernier", "page", "tenir", "haleine", "clore", "premier", "dernier", 
    "être", "impossible", "chose", "vrai", "lire", "chapitre", "donner", "garder", "gris", "zone", 
    "vraie", "question", "plein", "pleine", "prise", "prendre", "écrite", "écrit", "complètement", 
    "complet", "voix", "fort", "penser", "retour", "profondément", "genre", "vie", "fois", 
    "véritable", "exiger", "réussir", "construire", "autant", "manière", "jamais", "face", 
    "recommande", "tête", "annie", "ernal", "vouloir", "propre", "tard", "faire", "aise", "mettre", 
    "principal", "pousse", "juger", "bouche", "pourtant", "tourne", "temps", "regarder", "mot", 
    "oeil", "faite", "absolument", "poids", "autrice", "coup", "croire", "glisser", "dresser", "dresse",
    "attendre", "attendai", "bel", "mélange", "teinter", "conquis", "descente", "fond",
    "début", "forme", "laisser", "chercher", "cherche", "année", "haut", "vérité", "courir", 
    "impression", "refermer", "rarement", "important", "importance", "couleur", "dicken", "oui","homme" 
    "œuvre", "langue", "oublier", "chef", "zweig", "intérieur", "retrouver", "ici", "montre",
    "donne", "tomber", "mieux", "comprendre", "lien", "entier", "part", "approche", "découvrir", 
    "fonctionner", "équilibre", "monde", "an", "king", "maîtriser", "parfaitement", "nouveau",
    "poing", "discours", "loin", "ouvrage", "idée", "siècle", "enjeu", "xix", "cas", "donnée", 
    "précieux", "vision", "domaine", "ensemble", "éclairer", "vivre", "document", "dater",
    "voir", "durkheim", "bourdieu", "action", "manque", "Grishaverse", "écrivain", "mêle", "autour", 
    "chambre", "laisse", "huis", "mêler", "don", "bord", "terriblement", "plonger", "fil", "mont", 
    "monte", "traite", "porter", "narration", "mal", "changer", "tisser", "croisé",
      "aime", "sarah", "place", "travers", "littéraire" , "bleu" , "atmosphère", "interdire", "émotion",
      "emporter", "pan", "besoin", "levy", "marc", "écrire", "veux", "mcfadden", "rien", "venir", "coben", 
      "doser", "ecrire", "mélissa", "signe", "dimension", "touchée", "fonce", "joue", "sebald", "Millie"}

# Nettoyage pour vectorisation (garde tous les mots pour permettre les bigrams)
def nettoyer_avec_bigrams(texte: str) -> str:
    doc = nlp(texte.lower())
    tokens = [
        token.lemma_ for token in doc
        if token.is_alpha and not token.is_stop
    ]
    return " ".join(tokens)

# Extraction d’unigrams et bigrams (sans stopwords) pour comparaison humaine
def extraire_ngrams(texte: str, n: int = 2) -> set[str]:
    doc = nlp(texte.lower())
    tokens = [
        token.lemma_ for token in doc
        if token.is_alpha and not token.is_stop
    ]
    return set(
        " ".join(tokens[i:i+n])
        for i in range(len(tokens) - n + 1)
    )

# Extraction des mots-clés humains en commun (avec filtre sur les unigrams)
def extraire_mots_communs_humains(texte1: str, texte2: str) -> list[str]:
    unigrams1 = extraire_ngrams(texte1, 1)
    unigrams2 = extraire_ngrams(texte2, 1)
    bigrams1 = extraire_ngrams(texte1, 2)
    bigrams2 = extraire_ngrams(texte2, 2)

    mots_uni = unigrams1 & unigrams2
    mots_bi = bigrams1 & bigrams2

    mots_uni_filtrés = [m for m in mots_uni if m not in stopwords_personnalises]

    return sorted(mots_uni_filtrés + list(mots_bi))

# Fonction principale de recommandation
def recommander_livres(description_utilisateur: str, db: Session, id_livre_exclu: Optional[int] = None):
    interactions = db.query(Interaction).all()

    # Regrouper les descriptions par livre (en excluant le livre décrit)
    livre_to_descs = {}
    for inter in interactions:
        if inter.ID_Livre != id_livre_exclu:
            livre_to_descs.setdefault(inter.ID_Livre, []).append(inter.Description)

    livres_ids = list(livre_to_descs.keys())
    corpus = [nettoyer_avec_bigrams(" ".join(descs)) for descs in livre_to_descs.values()]
    description_propre = nettoyer_avec_bigrams(description_utilisateur)

    print("DESCRIPTION UTILISATEUR NETTOYÉE :", description_propre)
    if corpus:
        print("CORPUS[0] NETTOYÉ :", corpus[0])

    # Vectorisation TF-IDF + Similarité cosinus
    full_corpus = [description_propre] + corpus
    vectorizer = TfidfVectorizer(ngram_range=(1, 3))
    tfidf_matrix = vectorizer.fit_transform(full_corpus)
    scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    recommandations = []
    top_results = sorted(zip(livres_ids, scores, corpus), key=lambda x: x[1], reverse=True)[:7]

    for i, (id_livre, score, _) in enumerate(top_results):
        livre = db.query(Livre).filter(Livre.ID_Livre == id_livre).first()
        if not livre:
            continue

        full_desc_livre = " ".join(livre_to_descs[id_livre])
        mots_commun_humains = extraire_mots_communs_humains(description_utilisateur, full_desc_livre)

        recommandations.append({
            "ID_Livre": livre.ID_Livre,
            "Titre": livre.Titre,
            "Auteur": livre.Auteur,
            "URL_Couverture": livre.URL_Couverture,
            "Score": round(score, 5),
            "Mots_Commun": mots_commun_humains[:15]
        })

    return recommandations

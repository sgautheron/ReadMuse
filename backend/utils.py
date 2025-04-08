# Fonction améliorée pour générer un profil littéraire à partir de descriptions, en utilisant des thèmes plus riches

themes = {
    "intrigue": ["suspense", "mystère", "rebondissement", "haletant", "thriller", "policier", "enquête", "révélation", "secret"],
    "style": ["langage", "poétique", "fluide", "plume", "narration", "description", "dialogue", "voix", "lyrique"],
    "émotions": ["émouvant", "triste", "joyeux", "touchant", "sentimental", "intense", "angoissant"],
    "univers": ["imaginaire", "réaliste", "historique", "futuriste", "fantastique", "dystopique", "mythologique"],
    "personnages": ["attachant", "complexe", "psychologie", "relation", "héroïne", "protagoniste"],
    "rythme": ["lent", "rapide", "captivant", "page-turner", "addictif", "monotone"],
    "thématiques sociales": ["féminisme", "discrimination", "racisme", "sexualité", "pauvreté"],
    "philosophie / introspection": ["existence", "mort", "sens", "vérité", "âme", "choix", "réflexion"],
    "relations humaines": ["amour", "amitié", "famille", "trahison", "liaison"],
    "ambiance": ["sombre", "lumière", "oppressant", "mélancolique", "doux"],
}

def generer_profil_litteraire(descriptions: list[str]) -> str:
    all_text = " ".join(descriptions).lower()

    correspondances = {}

    for theme, mots in themes.items():
        for mot in mots:
            if mot in all_text:
                correspondances[theme] = correspondances.get(theme, 0) + 1

    if not correspondances:
        return "Votre profil littéraire est encore en construction... ajoutez plus de descriptions pour le découvrir !"

    # Trier les thèmes par nombre de mots trouvés
    themes_ordonnés = sorted(correspondances.items(), key=lambda x: x[1], reverse=True)

    phrases = {
        "intrigue": "les intrigues complexes et pleines de rebondissements",
        "style": "les styles d'écriture soignés et originaux",
        "émotions": "les lectures qui procurent des émotions fortes",
        "univers": "les univers riches et immersifs",
        "personnages": "les personnages profonds et nuancés",
        "rythme": "les rythmes narratifs marqués, qu'ils soient lents ou intenses",
        "thématiques sociales": "les romans engagés sur des questions de société",
        "philosophie / introspection": "les récits à portée philosophique ou introspective",
        "relations humaines": "les histoires centrées sur les relations humaines",
        "ambiance": "les ambiances marquées et mémorables",
    }

    profil = "Vous semblez apprécier particulièrement "
    profil += ", ".join([phrases[t[0]] for t in themes_ordonnés[:3]]) + "."

    return profil.capitalize()

# Exemple d'utilisation test
test_descriptions = [
    "J'ai adoré le suspense haletant et les personnages très bien développés.",
    "Un roman poétique, lyrique et plein de mélancolie.",
    "Les thèmes abordés autour de la famille et de l'amour m'ont beaucoup touché."
]

generer_profil_litteraire(test_descriptions)
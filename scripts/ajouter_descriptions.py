from backend.database import SessionLocal
from backend.models import Interaction
from datetime import datetime

db = SessionLocal()

descriptions = [
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25228,
        "Note": 3,
        "Description": "Plonger dans ces deux tomes de La Chronique des Bridgerton, c’est comme savourer un bonbon anglais sucré et pétillant. J’ai adoré les intrigues romantiques qui se nouent entre bal masqué, confidences secrètes et rivalités amoureuses. Le style est charmant, l’ambiance victorienne délicieusement immersive, et l’humour mordant de Lady Whistledown ajoute une touche irrésistible."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25229,
        "Note": 3,
        "Description": "Lady Whistledown revient avec son ironie piquante et son flair légendaire pour les ragots. C’est léger, drôle, finement observé. Un régal à lire quand on a envie d’un roman qui allie élégance, humour et petites piques bien senties sur la haute société."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25231,
        "Note": 3,
        "Description": "Ce roman m’a fascinée. On découvre l’envers du décor de Stranger Things à travers l’histoire poignante de Terry Ives. C’est sombre, haletant, et profondément humain. Les expériences menées sur elle m’ont glacée, mais sa détermination à résister m’a bouleversée."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25233,
        "Note": 3,
        "Description": "Riverdale – The Maple Murders, c’est une dose parfaite de mystère et de nostalgie. On retrouve les personnages qu’on adore, pris dans une enquête étrange et palpitante. L’ambiance est à la fois sucrée et inquiétante, et j’ai adoré me laisser embarquer dans cette fête qui vire au cauchemar."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25236,
        "Note": 3,
        "Description": "Ce livre est un coup de cœur. Trois femmes, trois luttes, une même force vitale. ‘La tresse’ est un roman d’une rare intensité émotionnelle, entre injustice sociale, espoir et résilience. J’ai été profondément touchée par ces voix qui tissent ensemble un message d’espoir et de solidarité."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25246,
        "Note": 3,
        "Description": "Marc Levy nous offre ici une aventure contemporaine façon Robin des Bois 2.0. C’est dynamique, engagé, plein de suspense et de personnages charismatiques. J’ai adoré suivre cette bande improbable qui agit dans l’ombre pour la justice. On tourne les pages sans s’arrêter."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25247,
        "Note": 3,
        "Description": "Une photo, un doute, une quête folle à travers le monde… Ce roman m’a complètement embarquée. C’est un mélange de romance et de thriller qui joue avec le mystère et le destin. L’amour y est comme une étoile qu’on poursuit, malgré les ténèbres."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25248,
        "Note": 3,
        "Description": "Un de mes préférés de Levy. Ce roman est une bombe émotionnelle sur fond de science et d’amitié. C’est poétique, profond, avec une réflexion fascinante sur la conscience. Entre amour, technologie et spiritualité, j’ai été emportée jusqu’à la dernière page."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25249,
        "Note": 3,
        "Description": "J’ai adoré l’ambiance entre mystère, romance et passé qui ressurgit. Ce roman est comme un rêve étrange où les frontières du temps s’effacent. On se laisse entraîner dans cette danse entre les époques avec fascination."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25250,
        "Note": 3,
        "Description": "Ce livre m’a brisé le cœur tout en m’apportant beaucoup d’espoir. C’est une histoire d’amour à distance, pleine de tendresse, de promesses silencieuses et de lettres poignantes. On y lit la force des liens invisibles qui traversent le temps et les continents."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25251,
        "Note": 3,
        "Description": "Une suite pleine d’action, d’idéal, et de personnages qu’on retrouve avec bonheur. C’est un peu comme une série Netflix qu’on ne veut pas quitter. Levy y mêle l’émotion et l’adrénaline avec une écriture qui file à toute allure."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25252,
        "Note": 3,
        "Description": "Si c’était à refaire, je le relirais sans hésiter. C’est un thriller temporel intelligent, avec des rebondissements à couper le souffle. On y retrouve toute la plume efficace de Levy, entre émotions intimes et suspense haletant."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25253,
        "Note": 3,
        "Description": "C’est un roman d’aventure et de découverte, mais surtout une ode à la curiosité et à l’amour. J’ai adoré le duo atypique entre une archéologue et un astrophysicien. Leur quête est fascinante, presque spirituelle."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25254,
        "Note": 3,
        "Description": "Une belle édition pour se plonger dans l’univers palpitant et engagé de la série 9. On y retrouve des personnages attachants, un rythme effréné, et cette volonté de changer le monde, coûte que coûte. C’est vibrant."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25255,
        "Note": 3,
        "Description": "Une comédie romantique pleine de charme, avec ce petit goût de film new-yorkais. J’ai ri, j’ai été émue, et j’ai adoré les personnages hauts en couleur de cet immeuble pas comme les autres. Marc Levy a le don de rendre les petits bonheurs extraordinaires."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25256,
        "Note": 3,
        "Description": "Ce roman m’a fait un bien fou. Deux femmes que tout oppose se rencontrent et partent sur les routes. Leur fuite devient une quête de sens, de liberté, et d’humanité. C’est doux, lumineux, bouleversant."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25259,
        "Note": 3,
        "Description": "Un coup de cœur d’enfance et de toujours. Le Petit Prince, c’est la poésie à l’état pur. Un livre qui parle à l’âme, aux enfants comme aux adultes. À chaque lecture, j’y découvre quelque chose de nouveau, d’essentiel, d’éternel."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25276,
        "Note": 3,
        "Description": "Madame Bovary est une œuvre magistrale, un miroir troublant sur les illusions du romantisme. Emma m’a touchée par sa naïveté, ses désirs déçus, sa quête d’évasion. C’est beau, cruel, et toujours aussi actuel."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25337,
        "Note": 3,
        "Description": "Un amour de Swann, c’est une plongée vertigineuse dans les méandres du désir, de la jalousie et de la mémoire. C’est dense, somptueux, parfois cruel, toujours juste. On lit Proust pour se perdre... et se retrouver."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25344,
        "Note": 3,
        "Description": "Lire À la recherche du temps perdu, c’est comme entrer dans une cathédrale littéraire. On y explore le souvenir, l’amour, l’art, la vie, dans toute leur subtilité. Une œuvre monumentale, hypnotique."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25464,
        "Note": 3,
        "Description": "Vol de nuit est une méditation sublime sur le courage et le devoir. Le style de Saint-Exupéry est à la fois poétique et intense. C’est un texte court mais puissant, une ode à la nuit, au ciel, à la solitude du pilote."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25484,
        "Note": 3,
        "Description": "Lettre à un otage, c’est un texte bref mais essentiel. Un cri d’humanité, une réflexion sur la guerre, l’amitié, l’exil. C’est une lettre qui nous parle encore aujourd’hui avec une force bouleversante."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25493,
        "Note": 3,
        "Description": "La promesse de l’aube est un des plus beaux hommages qu’un fils ait pu rendre à sa mère. C’est drôle, tendre, émouvant, profondément humain. Romain Gary y montre toute la beauté des rêves impossibles."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25497,
        "Note": 3,
        "Description": "Le sens de ma vie est une dernière confidence, pudique et lucide. On sent l’homme derrière l’écrivain, avec ses doutes, sa grandeur et ses fêlures. Un texte court, mais bouleversant."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25499,
        "Note": 3,
        "Description": "Ghost in love est un roman tendre et fantastique. Entre humour et mélancolie, Levy explore la frontière entre les vivants et les morts avec une légèreté profonde. Un joli conte sur l’amour qui traverse le temps."
    }
]


for desc in descriptions:
    interaction = Interaction(
        ID_Utilisateur=desc["ID_Utilisateur"],
        ID_Livre=desc["ID_Livre"],
        Note=desc["Note"],
        Description=desc["Description"],
        Date_Interaction=datetime.now()
    )
    db.add(interaction)

db.commit()
db.close()
print("✅ Descriptions ajoutées avec succès.")

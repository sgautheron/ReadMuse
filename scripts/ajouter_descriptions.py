from backend.database import SessionLocal
from backend.models import Interaction
from datetime import datetime

db = SessionLocal()

descriptions = [
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20802,
        "Note": 5,
        "Description": "Un tome plus sombre, plus psychologique. J’ai adoré l’évolution de Harry et la tension permanente. L’univers devient plus complexe, et la résistance contre Voldemort est prenante. L’écriture reste fluide et immersive."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20804,
        "Note": 5,
        "Description": "Une œuvre d’une beauté rare. La prose poétique de Nabokov est envoûtante. Je me suis perdue dans les jeux de miroir entre le poème et les commentaires. Une réflexion brillante sur la création et la folie.",
        "ID_Utilisateur": 1,
        "ID_Livre": 20802,
        "Note": 5,
        "Description": "Un tome plus sombre, plus psychologique. J’ai adoré l’évolution de Harry et la tension permanente. L’univers devient plus complexe, et la résistance contre Voldemort est prenante. L’écriture reste fluide et immersive.",
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20805,
        "Note": 4,
        "Description": "La plume de Fitzgerald est d’une élégance folle. Le récit m’a happé par son ambiance décadente, ses personnages ambigus et son rythme langoureux. Un classique amer, beau et désillusionné.",
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20806,
        "Note": 4,
        "Description": "Une dystopie haletante et originale ! Le mélange entre romance, action et apocalypse fonctionne à merveille. J’ai été émue par la relation entre Penryn et sa sœur, et j’ai dévoré ce livre en une nuit.",
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20809,
        "Note": 4,
        "Description": "Toujours aussi magique. Ce deuxième tome mêle humour, mystère et aventure. L’intrigue autour de la Chambre des Secrets est captivante, et on découvre un peu plus la richesse de l’univers.",
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20810,
        "Note": 4,
        "Description": "Un voyage absurde et profond. J’ai ri, réfléchi, parfois été perdu. Don Quichotte est un personnage fascinant, drôle et tragique. Une lecture dense mais essentielle, pleine de philosophie.",
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20811,
        "Note": 4,
        "Description": "Ce livre m’a bouleversée. Trois portraits de femmes face à l’horreur de la guerre. C’est intense, poignant et nécessaire. J’ai été profondément marquée par Kasia. Un roman engagé et profondément humain.",
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20812,
        "Note": 4,
        "Description": "Un manuel brillant mais glaçant. Les lois du pouvoir sont fascinantes, mais certaines m’ont mise mal à l’aise. Greene écrit avec précision et intelligence. Un livre à lire avec recul, mais passionnant.",
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20814,
        "Note": 4,
        "Description": "Chef-d’œuvre. Le regard de Scout sur une société injuste est bouleversant. Le personnage d’Atticus m’a inspirée. L’écriture est simple, mais d’une grande justesse. Un livre essentiel sur la justice.",
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 20815,
        "Note": 4,
        "Description": "Une tragédie intemporelle. Le style de Shakespeare demande un petit effort, mais les monologues d’Hamlet sont d’une profondeur incroyable. Une exploration de la folie, du doute et de la vengeance.",
    },]

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

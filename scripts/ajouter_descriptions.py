from backend.database import SessionLocal
from backend.models import Interaction
from datetime import datetime

db = SessionLocal()

descriptions = [
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25753,
        "Note": 4,
        "Description": "Le jeune homme est un texte fulgurant d’honnêteté. J’ai été bouleversée par la manière dont Annie Ernaux parle du désir, de l’âge, et de l’écriture avec autant de justesse et de lucidité."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25765,
        "Note": 4,
        "Description": "Journal du dehors m’a fascinée par sa façon de capter l’ordinaire. Annie Ernaux y observe notre époque avec une acuité rare, et chaque scène, si simple soit-elle, devient un fragment de mémoire collective."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25766,
        "Note": 3,
        "Description": "J’ai adoré redécouvrir le quotidien d’un hypermarché à travers les yeux d’Annie Ernaux. Regarde les lumières mon amour donne une voix à ce qu’on ne remarque plus. C’est presque poétique."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25768,
        "Note": 5,
        "Description": "Une femme est un livre déchirant et tendre. Ernaux y explore sa relation avec sa mère avec une sincérité qui m’a profondément émue. C’est intime et universel à la fois."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25774,
        "Note": 5,
        "Description": "L’événement est un texte coup de poing. Annie Ernaux ne cherche pas à enjoliver, elle expose la réalité brute d’un avortement clandestin. C’est bouleversant, nécessaire, inoubliable."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25777,
        "Note": 4,
        "Description": "Ce qu’ils disent ou rien m’a rappelé l’adolescence, ce moment où on cherche sa voix dans un monde où personne ne vous comprend. Une claque de lucidité et de rage sourde."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25783,
        "Note": 5,
        "Description": "La honte est un livre qui m’a mise face à mes propres souvenirs d’enfance. Annie Ernaux dissèque ce sentiment avec une telle finesse que j’en suis restée bouleversée longtemps après."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25788,
        "Note": 5,
        "Description": "Je ne suis pas sortie de ma nuit est un hommage pudique et poignant à une mère qui s’efface. J’ai lu ce livre en apnée, tant il est sincère et cruel à la fois. Une œuvre d’amour et de douleur."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25458,
        "Note": 4,
        "Description": "Citadelle est une œuvre contemplative, dense, presque mystique. Ce livre m’a accompagné comme un guide spirituel, exigeant mais lumineux."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 25459,
        "Note": 5,
        "Description": "Le Petit Prince m’a appris à regarder autrement, à voir avec le cœur. C’est un livre d’enfance qu’on comprend vraiment une fois adulte. Inépuisable en beauté et en sagesse."
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

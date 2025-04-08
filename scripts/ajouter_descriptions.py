from backend.database import SessionLocal
from backend.models import Interaction
from datetime import datetime

db = SessionLocal()

descriptions = [
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 24881,
        "Note": 4,
        "Description": "J'ai adoré la façon dont Foenkinos imagine Lennon en pleine introspection. L'aspect psychanalytique est original et poignant. On ressent toute la fragilité de l'artiste derrière l'icône."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 24882,
        "Note": 4,
        "Description": "Un roman coup de poing. L’histoire, inspirée d’un fait divers, m’a glacé. J’ai été bouleversé par la complexité des sentiments des personnages, et par la question de l’amour qui pousse à l’irréparable."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 24883,
        "Note": 3,
        "Description": "Un livre à la fois loufoque et tendre. L'idée de collectionner sa femme est à la fois poétique et absurde, dans le bon sens. J’ai beaucoup ri, mais aussi été touché par l’étrangeté d’Hector."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 24884,
        "Note": 5,
        "Description": "Une pépite ! Le mystère autour d’Henri Pick est haletant, mais c’est surtout l’amour des livres et la réflexion sur la légitimité artistique qui m’ont emballé. Un roman très intelligent."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 24886,
        "Note": 5,
        "Description": "Un choc émotionnel. Le style sobre et haché de Foenkinos colle parfaitement à la vie de Charlotte Salomon. J’ai été bouleversé par cette artiste oubliée. À lire absolument."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 24889,
        "Note": 4,
        "Description": "Un roman tendre et mélancolique. L’histoire de Nathalie et Markus est improbable, mais pleine d’humanité. C’est une vraie réflexion sur le deuil et le recommencement."
    },
    {
        "ID_Utilisateur": 1,
        "ID_Livre": 24890,
        "Note": 4,
        "Description": "La réécriture de l’affaire Florence Rey est aussi romanesque que troublante. Foenkinos explore les zones grises de l’amour, du choix et de la violence avec une intensité rare."
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

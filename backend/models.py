from sqlalchemy import Column, Integer, String, Text
from backend.database import Base  # ✅ Correction de l'import

class Livre(Base):
    __tablename__ = "Livres"  # Assure-toi que c'est bien "Livres"

    ID_Livre = Column(Integer, primary_key=True, index=True)  # Changement de "id" en "ID_Livre"
    Titre = Column(String, index=True)  # Changement de "title" en "Titre"
    Auteur = Column(String)  # Changement de "author" en "Auteur"
    Genre = Column(String)  # Ajout de la colonne Genre
    Mots_Cles = Column(Text)  # Ajout de la colonne Mots_Cles
    Resume = Column(Text)  # Changement de "description" en "Resume"
    Date_Publication = Column(String)  # Ajout de la colonne Date_Publication
    Editeur = Column(String)  # Ajout de la colonne Editeur
    Nombre_Pages = Column(Integer)  # Ajout de la colonne Nombre_Pages
    URL_Couverture = Column(String)  # Changement de "cover_url" en "URL_Couverture"

from sqlalchemy import Column, Integer, String, Text
from backend.database import Base  # ✅ Correction de l'import

class Livre(Base):
    __tablename__ = "Livres"

    ID_Livre = Column(Integer, primary_key=True, index=True)
    Titre = Column(String, index=True)
    Auteur = Column(String)
    Genre = Column(String)
    Mots_Cles = Column(Text)
    Resume = Column(Text) 
    Date_Publication = Column(String) 
    Editeur = Column(String) 
    Nombre_Pages = Column(Integer)
    URL_Couverture = Column(String)

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base
from sqlalchemy.sql import func

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

    # ✅ Relation avec les interactions (un livre peut avoir plusieurs interactions)
    interactions = relationship("Interaction", back_populates="livre")

class Interaction(Base):
    __tablename__ = "Interactions"

    ID_Interaction = Column(Integer, primary_key=True, index=True)
    ID_Utilisateur = Column(Integer, ForeignKey("Utilisateurs.ID_Utilisateur"))
    ID_Livre = Column(Integer, ForeignKey("Livres.ID_Livre"))
    Note = Column(Integer)
    Date_Interaction = Column(DateTime, default=func.now())
    Description = Column(Text)

    # ✅ Relation vers Livre (chaque interaction est liée à un livre)
    livre = relationship("Livre", back_populates="interactions")
    utilisateur = relationship("Utilisateur", back_populates="interactions")


class Utilisateur(Base):
    __tablename__ = "Utilisateurs"

    ID_Utilisateur = Column(Integer, primary_key=True, index=True)
    Nom = Column(String(100), nullable=False) 
    Email = Column(String(255), unique=True, nullable=False)
    Mot_De_Passe = Column(String(100), nullable=False)  

    # ✅ Relation avec les interactions
    interactions = relationship("Interaction", back_populates="utilisateur")

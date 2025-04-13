from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base
from sqlalchemy.sql import func
from datetime import datetime


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
    Categorie = Column(String)  # 👈 Assure-toi que cette ligne est bien là

    interactions = relationship("Interaction", back_populates="livre")
    favoris = relationship("Favori", back_populates="livre", cascade="all, delete")


class Utilisateur(Base):
    __tablename__ = "Utilisateurs"

    ID_Utilisateur = Column(Integer, primary_key=True, index=True)
    Nom = Column(String(100), nullable=False)
    Email = Column(String(255), unique=True, nullable=False)
    Mot_De_Passe = Column(String(100), nullable=False)

    interactions = relationship("Interaction", back_populates="utilisateur")
    favoris = relationship("Favori", back_populates="utilisateur", cascade="all, delete")
    
    cercle = relationship(
        "Cercle",
        foreign_keys="[Cercle.ID_Utilisateur]",
        back_populates="utilisateur",
        cascade="all, delete"
    )
    membres = relationship(
        "Cercle",
        foreign_keys="[Cercle.ID_Membre]",
        back_populates="membre",
        cascade="all, delete"
    )


class Interaction(Base):
    __tablename__ = "Interactions"

    ID_Interaction = Column(Integer, primary_key=True, index=True)
    ID_Utilisateur = Column(Integer, ForeignKey("Utilisateurs.ID_Utilisateur"))
    ID_Livre = Column(Integer, ForeignKey("Livres.ID_Livre"))
    Note = Column(Integer)
    Date_Interaction = Column(DateTime, default=func.now())
    Description = Column(Text)

    livre = relationship("Livre", back_populates="interactions")
    utilisateur = relationship("Utilisateur", back_populates="interactions")


class Favori(Base):
    __tablename__ = "Favoris"

    ID_Favori = Column(Integer, primary_key=True, index=True)
    ID_Utilisateur = Column(Integer, ForeignKey("Utilisateurs.ID_Utilisateur"))
    ID_Livre = Column(Integer, ForeignKey("Livres.ID_Livre"))

    utilisateur = relationship("Utilisateur", back_populates="favoris")
    livre = relationship("Livre", back_populates="favoris")


class Cercle(Base):
    __tablename__ = "Cercle"

    ID_Utilisateur = Column(Integer, ForeignKey("Utilisateurs.ID_Utilisateur"), primary_key=True)
    ID_Membre = Column(Integer, ForeignKey("Utilisateurs.ID_Utilisateur"), primary_key=True)
    Date_ajout = Column(DateTime, default=datetime.utcnow)

    utilisateur = relationship("Utilisateur", foreign_keys=[ID_Utilisateur], back_populates="cercle")
    membre = relationship("Utilisateur", foreign_keys=[ID_Membre], back_populates="membres")

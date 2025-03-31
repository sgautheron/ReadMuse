from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.models import Utilisateur
from backend.schemas import UtilisateurCreate, LoginRequest
from backend.database import get_db

auth_router = APIRouter()

@auth_router.post("/utilisateurs/")
def creer_utilisateur(user: UtilisateurCreate, db: Session = Depends(get_db)):
    existing = db.query(Utilisateur).filter_by(Email=user.Email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    new_user = Utilisateur(
        Nom=user.Nom,
        Email=user.Email,
        Mot_De_Passe=user.Mot_De_Passe  # Tu peux ajouter un hash si tu veux
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.ID_Utilisateur, "message": "Utilisateur créé"}

@auth_router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter_by(Email=request.Email).first()
    if not user or user.Mot_De_Passe != request.Mot_De_Passe:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    return {"id": user.ID_Utilisateur, "message": "Connexion réussie"}

@auth_router.post("/utilisateurs/login")
def login_user(user: UtilisateurCreate, db: Session = Depends(get_db)):
    db_user = db.query(Utilisateur).filter(Utilisateur.Email == user.Email).first()
    if not db_user or db_user.Mot_De_Passe != user.Mot_De_Passe:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    return {"message": "Connexion réussie", "utilisateur": {
        "ID_Utilisateur": db_user.ID_Utilisateur,
        "Nom": db_user.Nom,
        "Email": db_user.Email
    }}

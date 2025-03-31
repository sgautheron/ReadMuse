from pydantic import BaseModel
from pydantic import BaseModel, Field
from typing import Optional

class UtilisateurCreate(BaseModel):
    Nom: str
    Email: str
    Mot_De_Passe: str

class LoginRequest(BaseModel):
    Email: str
    Mot_De_Passe: str

class InteractionCreate(BaseModel):
    ID_Utilisateur: int = Field(..., alias="ID_Utilisateur")
    ID_Livre: int = Field(..., alias="ID_Livre")
    Note: Optional[int] = None 
    Description: str = Field(..., alias="Description")

    class Config:
        allow_population_by_field_name = True

class Description(BaseModel):
    texte: str


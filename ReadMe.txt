ReadMuse - Guide d'installation et d'exécution

Avant de lancer le projet, assurez-vous d'avoir installé les éléments suivants :

Python 3.9+ (https://www.python.org/downloads/)

Node.js 16+ (https://nodejs.org/)

SQLite (inclus avec Python, mais peut nécessiter une installation spécifique selon l’OS)



2. Installation et exécution

2.1. Backend

Aller dans le dossier du parent :
cd ReadMuse


Installer les dépendances Python :

pip install -r requirements.txt

Lancer l’API FastAPI :

python3 -m uvicorn backend.main:app --reload

Adresse de l’API : http://127.0.0.1:8000/livres/



2.2. Frontend

Aller dans le dossier du frontend :

cd ReadMuse_UI

Installer les dépendances :

npm install

Lancer l’application React :

npm run dev

Adresse du frontend : http://localhost:5173/


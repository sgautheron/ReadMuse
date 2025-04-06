import requests
import sqlite3
import time
import os
from datetime import datetime

# 🔐 Clé API Google Books
API_KEY = "AIzaSyAkiZ59B6x_NGhmcC1Emvd3lc1IfgHbNO4"

# 📍 Chemin absolu vers la base de données
DATABASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/bdd_readmuse.db"))

# 📊 Paramètres API
MAX_RESULTS = 40

# 🔖 Requêtes tendances pour les livres populaires actuels en France
TRENDING_QUERIES = {
    "Nouveautés 2024": "nouveautés littéraires 2024",
    "Best-sellers France": "best sellers romans France 2024",
    "Romans du moment": "romans qui font parler 2024",
    "Prix littéraires": "Goncourt Renaudot Interallié Femina 2024",
    "Écrivains médiatisés": "Nicolas Demorand Amélie Nothomb Virginie Despentes"
}


# 🔍 Récupération des livres depuis l'API
def fetch_books_from_google(query, category):
    url = (
        f"https://www.googleapis.com/books/v1/volumes?q={query}"
        f"&maxResults={MAX_RESULTS}&langRestrict=fr&printType=books&orderBy=newest&key={API_KEY}"
    )
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return [extract_book_data(b, category) for b in data.get("items", [])]
    except requests.RequestException as e:
        print(f"⚠️ Erreur API pour '{query}': {e}")
        return []


# 🧠 Extraction des données
def extract_book_data(item, category):
    volume = item.get("volumeInfo", {})
    return {
        "Titre": volume.get("title", "Titre inconnu"),
        "Auteur": ", ".join(volume.get("authors", ["Inconnu"])),
        "Genre": ", ".join(volume.get("categories", ["Inconnu"])),
        "Resume": volume.get("description", "Résumé non disponible"),
        "Date_Publication": volume.get("publishedDate", ""),
        "Editeur": volume.get("publisher", "Inconnu"),
        "Nombre_Pages": volume.get("pageCount", 0),
        "URL_Couverture": volume.get("imageLinks", {}).get("thumbnail", ""),
        "ISBN": extract_isbn(volume.get("industryIdentifiers", [])),
        "Categorie": category
    }


def extract_isbn(identifiers):
    for id in identifiers:
        if id.get("type") in ["ISBN_13", "ISBN_10"]:
            return id.get("identifier")
    return ""


# 📥 Insertion en base de données
def livre_deja_present(conn, titre, auteur):
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM Livres WHERE Titre = ? AND Auteur = ?", (titre, auteur))
    return cursor.fetchone() is not None


def insert_books(books):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    livres_inserts = []
    titres_auteurs_seen = set()

    for b in books:
        key = (b["Titre"], b["Auteur"])
        if key in titres_auteurs_seen:
            continue
        if not livre_deja_present(conn, *key):
            livres_inserts.append((
                b["Titre"], b["Auteur"], b["Genre"], b["Resume"],
                b["Date_Publication"], b["Editeur"], b["Nombre_Pages"],
                b["URL_Couverture"], b["ISBN"], b["Categorie"]
            ))
            titres_auteurs_seen.add(key)

    if livres_inserts:
        cursor.executemany("""
            INSERT INTO Livres 
            (Titre, Auteur, Genre, Resume, Date_Publication, Editeur, Nombre_Pages, URL_Couverture, ISBN, Categorie)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, livres_inserts)
        conn.commit()
        print(f"✅ {len(livres_inserts)} livres insérés dans la base.")
    else:
        print("⚠️ Aucun nouveau livre à insérer.")

    conn.close()


# 🚀 Script principal
if __name__ == "__main__":
    for category, query in TRENDING_QUERIES.items():
        print(f"\n🔍 Catégorie : {category} → Requête : '{query}'")
        books = fetch_books_from_google(query, category)
        if books:
            insert_books(books)
        else:
            print(f"❌ Aucun livre trouvé pour : {query}")

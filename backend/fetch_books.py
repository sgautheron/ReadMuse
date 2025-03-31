import requests
import sqlite3
import time
import os

# 🔐 Clé API Google Books
API_KEY = "AIzaSyAkiZ59B6x_NGhmcC1Emvd3lc1IfgHbNO4"

# 📍 Chemin absolu vers la base de données
DATABASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/bdd_readmuse.db"))

# 📊 Paramètres API
MAX_RESULTS = 40  # Maximum autorisé par requête Google Books

# 🔖 Liste des catégories à scraper
CATEGORIES = {
    "Best Books Ever": "best books of all time",
    "Award Winners": "award winning books",
    "BookTok": "booktok",
    "Adapted to Movies": "bestseller adapted to movie",
    "Books to Read Before You Die": "books to read before you die",
    "Life-Changing": "life changing books",
    "Books That Changed the World": "books that changed the world",
    "Sad Books": "sad books",
    "To Cry": "books to cry",
    "To Heal": "books to heal",
    "About Love": "books about love",
    "About Friendship": "books about friendship",
    "Heartbreak": "books about heartbreak",
    "Romance": "romantic novels",
    "Fantasy": "fantasy saga",
    "Mystery": "mystery thrillers",
    "Sci-Fi": "science fiction bestsellers",
    "Historical Fiction": "historical fiction",
    "Young Adult": "YA novels",
    "Dystopia": "dystopian novels",
    "Autobiographies": "autobiographies",
    "Short Reads": "short books to read in a day",
    "One Sitting": "books to read in one sitting",
    "Cozy": "cozy reads",
    "Written by Women": "books written by women",
    "Plot Twists": "books with plot twists",
    "Strong Female Leads": "books with strong female leads",
    "Beautiful Writing": "beautiful writing",
    "Unreliable Narrators": "books with unreliable narrators",
    "2020s Hits": "best books 2020s",
    "2010s Hits": "best books 2010s",
    "2000s Hits": "best books 2000s",
}

# 📚 Récupération depuis Google Books

def fetch_books_from_google(query, category):
    url = (
        f"https://www.googleapis.com/books/v1/volumes?q={query}" 
        f"&maxResults={MAX_RESULTS}&langRestrict=fr&printType=books&key={API_KEY}"
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

# 📥 Insertion en base

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
        print(f"✅ {len(livres_inserts)} livres insérés !")
    else:
        print("⚠️ Aucun nouveau livre à insérer.")

    conn.close()

# 🚀 Main

if __name__ == "__main__":
    for category, query in CATEGORIES.items():
        print(f"\n🔍 Catégorie : {category} → Recherche : '{query}'")
        books = fetch_books_from_google(query, category)
        if books:
            insert_books(books)
        time.sleep(1)

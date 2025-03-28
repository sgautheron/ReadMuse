import requests
import sqlite3
import time

# 🔐 Ta clé API Google Books
API_KEY = "AIzaSyAkiZ59B6x_NGhmcC1Emvd3lc1IfgHbNO4"

# 📍 Chemin vers la base de données
import os
DATABASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/bdd_readmuse.db"))

# 📊 Paramètres
START_INDEX = 0  # 👉 Indice de départ pour ne pas reprendre les mêmes
TOTAL_RESULTS = 500
MAX_RESULTS = 40  # Max autorisé par Google Books

def fetch_books_from_google(start_index=0, max_results=MAX_RESULTS):
    """Récupère des livres en français depuis Google Books."""
    url = (
        f"https://www.googleapis.com/books/v1/volumes?"
        f"q=roman ado&startIndex={start_index}&maxResults={max_results}"
        f"&langRestrict=fr&printType=books&key={API_KEY}"
    )
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data.get("items", [])
    except requests.RequestException as e:
        print(f"⚠️ Erreur API Google Books : {e}")
        return []

def extract_book_data(item):
    """Extrait les données utiles d’un livre."""
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
    }

def extract_isbn(identifiers):
    """Extrait un ISBN s’il existe."""
    for id in identifiers:
        if id.get("type") in ["ISBN_13", "ISBN_10"]:
            return id.get("identifier")
    return ""

def livre_deja_present(conn, titre, auteur):
    """Vérifie si un livre est déjà en base par titre et auteur."""
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
            continue  # doublon dans la même session

        if not livre_deja_present(conn, b["Titre"], b["Auteur"]):
            livres_inserts.append((
                b["Titre"], b["Auteur"], b["Genre"], b["Resume"],
                b["Date_Publication"], b["Editeur"],
                b["Nombre_Pages"], b["URL_Couverture"], b["ISBN"]
            ))
            titres_auteurs_seen.add(key)
        else:
            print(f"⏭️ Livre déjà en base : {b['Titre']} — {b['Auteur']}")

    if livres_inserts:
        cursor.executemany("""
            INSERT INTO Livres 
            (Titre, Auteur, Genre, Resume, Date_Publication, Editeur, Nombre_Pages, URL_Couverture, ISBN)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, livres_inserts)
        conn.commit()
        print(f"✅ {len(livres_inserts)} nouveaux livres insérés dans la base !")
    else:
        print("⚠️ Aucun nouveau livre à insérer.")

    conn.close()


if __name__ == "__main__":
    all_books = []

    for start in range(START_INDEX, START_INDEX + TOTAL_RESULTS, MAX_RESULTS):
        print(f"📚 Récupération des livres à partir de {start}...")
        raw_books = fetch_books_from_google(start)
        books = [extract_book_data(b) for b in raw_books]
        all_books.extend(books)

    if all_books:
        insert_books(all_books)
    else:
        print("⚠️ Aucun livre récupéré.")

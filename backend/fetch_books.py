import requests
import sqlite3
import time

# Chemin vers la base de données
DATABASE_PATH = "data/bdd_readmuse.db"

# Nombre max de résultats par page
RESULTS_PER_PAGE = 100  
TOTAL_RESULTS = 1000  # Nombre total de livres à récupérer

# Liste des genres
GENRES = [
    "science_fiction", "fantasy", "mystery", "romance",
    "historical_fiction", "horror", "biography", "self_help",
    "poetry", "children", "young_adult", "thriller", "philosophy"
]

def fetch_book_details(olid):
    """ 🔍 Récupère les détails d'un livre via son OLID (Résumé + Nombre de pages) """
    url = f"https://openlibrary.org/works/{olid}.json"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        book = response.json()

        # Récupération du résumé
        resume = book.get("description", {})
        if isinstance(resume, dict):
            resume = resume.get("value", "")

        # Récupération du nombre de pages via l'édition
        edition_id = book.get("covers", [None])[0]  # première édition si dispo
        if edition_id:
            pages = fetch_pages_from_edition(edition_id)
        else:
            pages = "Nombre de pages inconnu"

        return {
            "Resume": resume if resume else "Résumé non disponible",
            "Nombre_Pages": pages
        }
    except requests.RequestException:
        return {"Resume": "Résumé non disponible", "Nombre_Pages": "Nombre de pages inconnu"}

def fetch_pages_from_edition(edition_id):
    """ 📖 Récupère le nombre de pages via l'édition d'un livre """
    url = f"https://openlibrary.org/books/{edition_id}.json"

    try:
        response = requests.get(url)
        response.raise_for_status()
        edition = response.json()
        return edition.get("number_of_pages", "Nombre de pages inconnu")
    except requests.RequestException:
        return "Nombre de pages inconnu"

def fetch_books_by_subject(subject, limit=RESULTS_PER_PAGE):
    """ 📚 Récupère les livres d'un sujet donné sur Open Library """
    url = f"https://openlibrary.org/subjects/{subject}.json?limit={limit}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        books = response.json().get("works", [])
    except requests.RequestException as e:
        print(f"⚠️ Erreur lors de la récupération des livres ({subject}): {e}")
        return []

    book_data = []
    for book in books:
        olid = book.get("key", "").replace("/works/", "")
        details = fetch_book_details(olid)  # Récupération du résumé + nb de pages

        book_data.append({
            "Titre": book.get("title", "N/A"),
            "Auteur": ", ".join([a["name"] for a in book.get("authors", [{"name": "Inconnu"}])]),
            "Genre": subject.replace("_", " ").title(),  # Convertit "science_fiction" → "Science Fiction"
            "Date_Publication": book.get("first_publish_year", ""),
            "Editeur": "Inconnu",
            "Resume": details["Resume"],  # Ajout du résumé
            "Nombre_Pages": details["Nombre_Pages"],  # Ajout du nb de pages
            "URL_Couverture": f"https://covers.openlibrary.org/b/id/{book.get('cover_id', '')}-L.jpg" if book.get("cover_id") else "",
        })

    print(f"✅ {len(book_data)} livres récupérés pour le sujet '{subject}'")
    return book_data

def insert_books(books):
    if not books:
        print("⚠️ Aucun livre à insérer.")
        return
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.executemany("""
        INSERT OR IGNORE INTO Livres 
        (Titre, Auteur, Genre, Date_Publication, Editeur, Resume, Nombre_Pages, URL_Couverture)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, [(b["Titre"], b["Auteur"], b["Genre"], b["Date_Publication"], b["Editeur"], 
           b["Resume"], b["Nombre_Pages"], b["URL_Couverture"]) for b in books])

    conn.commit()
    conn.close()
    print(f"✅ {len(books)} nouveaux livres insérés avec résumé et nombre de pages !")

if __name__ == "__main__":
    all_books = []
    
    # Récupération des livres pour chaque genre
    for genre in GENRES:
        print(f"📚 Récupération des livres pour le genre : {genre}")
        books = fetch_books_by_subject(genre)
        all_books.extend(books)
        time.sleep(1) 

    if all_books:
        insert_books(all_books)
        print(f"✅ Base de données mise à jour avec {len(all_books)} nouveaux livres !")
    else:
        print("⚠️ Aucun livre ajouté à la base de données.")

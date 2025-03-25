import requests
import sqlite3
import time

# ✅ Chemin vers la base de données
DATABASE_PATH = "data/bdd_readmuse.db"

# 🔹 Nombre max de résultats par page (on réduit à 20 pour éviter erreurs 500)
RESULTS_PER_PAGE = 20  

# 🎯 Genres ciblés (thèmes populaires sur Open Library)
GENRES = [
    "science_fiction", "fantasy", "mystery", "romance",
    "historical_fiction", "horror", "biography", "self_help",
    "poetry", "children", "young_adult", "thriller", "philosophy"
]

# ✅ Header pour éviter les blocages serveurs
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ReadMuseBot/1.0; +http://readmuse.fr)"
}

def fetch_book_details(olid):
    """ 🔍 Récupère les détails d'un livre via son OLID : résumé et pages """
    url = f"https://openlibrary.org/works/{olid}.json"
    
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        book = response.json()

        # Résumé
        resume = book.get("description", {})
        if isinstance(resume, dict):
            resume = resume.get("value", "")
        elif isinstance(resume, str):
            resume = resume
        else:
            resume = ""

        # 🔍 Pour récupérer une édition et en extraire les pages
        editions_url = f"https://openlibrary.org/works/{olid}/editions.json?limit=1"
        pages = "Inconnu"
        try:
            res_ed = requests.get(editions_url, headers=HEADERS)
            res_ed.raise_for_status()
            editions = res_ed.json().get("entries", [])
            if editions:
                pages = editions[0].get("number_of_pages", "Inconnu")
        except requests.RequestException:
            pass

        return {
            "Resume": resume.strip() if resume else "Résumé non disponible",
            "Nombre_Pages": pages
        }
    except requests.RequestException:
        return {"Resume": "Résumé non disponible", "Nombre_Pages": "Inconnu"}

def fetch_books_by_subject(subject, limit=RESULTS_PER_PAGE):
    """ 📚 Récupère les livres populaires d’un sujet Open Library """
    url = f"https://openlibrary.org/subjects/{subject}.json?limit={limit}&sort=edition_count"
    
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        books = response.json().get("works", [])
    except requests.RequestException as e:
        print(f"⚠️ Erreur lors de la récupération des livres ({subject}): {e}")
        return []

    book_data = []
    for book in books:
        olid = book.get("key", "").replace("/works/", "")
        details = fetch_book_details(olid)

        book_data.append({
            "Titre": book.get("title", "N/A"),
            "Auteur": ", ".join([a["name"] for a in book.get("authors", [{"name": "Inconnu"}])]),
            "Genre": subject.replace("_", " ").title(),
            "Date_Publication": book.get("first_publish_year", ""),
            "Editeur": "Inconnu",
            "Resume": details["Resume"],
            "Nombre_Pages": details["Nombre_Pages"],
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
    print(f"📚 {len(books)} livres insérés avec succès dans la base !")

if __name__ == "__main__":
    all_books = []
    
    for genre in GENRES:
        print(f"📚 Récupération des livres pour le genre : {genre}")
        books = fetch_books_by_subject(genre)
        all_books.extend(books)
        time.sleep(1)  # 🔄 Pause pour éviter d’être bloqué

    if all_books:
        insert_books(all_books)
        print(f"🎉 Base de données mise à jour avec {len(all_books)} livres populaires !")
    else:
        print("⚠️ Aucun livre ajouté.")

import requests
import sqlite3
import time

# ✅ Chemin correct vers la base de données
DATABASE_PATH = "data/bdd_readmuse.db"


API_KEY = "AIzaSyAkiZ59B6x_NGhmcC1Emvd3lc1IfgHbNO4"

def fetch_books_from_google(query="fiction", max_results=100):
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults={max_results}&key={API_KEY}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Lève une erreur si la requête échoue
        books = response.json()
    except requests.RequestException as e:
        print(f"⚠️ Erreur lors de la récupération des livres : {e}")
        return []

    book_data = []
    for item in books.get("items", []):
        volume_info = item.get("volumeInfo", {})

        # Gestion de l'ISBN (certains livres ont plusieurs formats)
        industry_identifiers = volume_info.get("industryIdentifiers", [])
        isbn = ""
        if industry_identifiers:
            for identifier in industry_identifiers:
                if identifier.get("type") == "ISBN_13":
                    isbn = identifier.get("identifier", "")
                    break  # Priorité à ISBN_13

        book_data.append({
            "Titre": volume_info.get("title", "N/A"),
            "Auteur": ", ".join(volume_info.get("authors", ["Inconnu"])),
            "Genre": ", ".join(volume_info.get("categories", ["Inconnu"])),
            "Mots_Cles": ", ".join(volume_info.get("categories", [""])),  
            "Résumé": volume_info.get("description", ""),
            "Date_Publication": volume_info.get("publishedDate", ""),
            "Editeur": volume_info.get("publisher", "Inconnu"),
            "Nombre_Pages": volume_info.get("pageCount", 0),
            "ISBN": isbn,
            "URL_Couverture": volume_info.get("imageLinks", {}).get("thumbnail", ""),
        })

    return book_data

def insert_books(books):
    """ Insère les livres dans la base de données en évitant les doublons d'ISBN. """
    if not books:
        print("⚠️ Aucun livre à insérer.")
        return
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.executemany("""
        INSERT OR IGNORE INTO Livres 
        (Titre, Auteur, Genre, Mots_Cles, Resume, Date_Publication, Editeur, Nombre_Pages, ISBN, URL_Couverture)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, [(b["Titre"], b["Auteur"], b["Genre"], b["Mots_Cles"], b["Résumé"], b["Date_Publication"], b["Editeur"], b["Nombre_Pages"], b["ISBN"], b["URL_Couverture"]) for b in books])

    conn.commit()
    conn.close()
    print(f"✅ {len(books)} nouveaux livres insérés !")

if __name__ == "__main__":
    genres = ["science fiction", "fantasy", "history", "mystery", "romance", "thriller", "non-fiction"]

all_books = []
for genre in genres:
    print(f"📚 Récupération de livres pour le genre : {genre}")
    books = fetch_books_from_google(genre, 10)  # Récupère 100 livres par genre
    all_books.extend(books)  # Ajoute les livres à la liste principale
    time.sleep(2)  # ⏳ Ajoute une pause de 2 secondes entre chaque requête

if all_books:
    insert_books(all_books)
    print(f"✅ Base de données mise à jour avec {len(all_books)} nouveaux livres !")
else:
    print("⚠️ Aucun livre ajouté à la base de données.")
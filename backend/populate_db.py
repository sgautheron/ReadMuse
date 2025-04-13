import sqlite3
from scripts.fetch_books import fetch_books_from_openlibrary

# Chemin vers la base de données
DATABASE_PATH = "data/bdd_readmuse.db"  

def insert_books(books):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.executemany("""
        INSERT OR IGNORE INTO Livres 
        (Titre, Auteur, Genre, Mots_Cles, Resume, Date_Publication, Editeur, Nombre_Pages, URL_Couverture)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, [(b["Titre"], b["Auteur"], b["Genre"], b["Mots_Cles"], b["Resume"], b["Date_Publication"], b["Editeur"], b["Nombre_Pages"], b["URL_Couverture"]) for b in books])

    conn.commit()
    conn.close()


if __name__ == "__main__":
    books = fetch_books_from_openlibrary(100, 1)  # Récupération des 100 livres de la première page
    insert_books(books)
    print("✅ Base de données mise à jour avec succès !")

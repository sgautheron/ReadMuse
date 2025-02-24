import sqlite3
from fetch_books import fetch_books_from_google

# ✅ Chemin correct vers la base de données
DATABASE_PATH = "data/bdd_readmuse.db"  

def insert_books(books):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.executemany("""
        INSERT OR IGNORE INTO Livres (Titre, Auteur, Genre, Mots_Cles, Resume, Date_Publication, Editeur, Nombre_Pages, ISBN, URL_Couverture)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, [(b["Titre"], b["Auteur"], b["Genre"], b["Mots_Cles"], b["Résumé"], b["Date_Publication"], b["Editeur"], b["Nombre_Pages"], b["ISBN"], b["URL_Couverture"]) for b in books])

    conn.commit()
    conn.close()


if __name__ == "__main__":
    books = fetch_books_from_google("science fiction", 10)
    insert_books(books)
    print("Base de données mise à jour avec succès !")

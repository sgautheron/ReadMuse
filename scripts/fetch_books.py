import requests
import sqlite3
import os

# 🔐 Clé API Google Books
API_KEY = "AIzaSyCFau7PL7tkRcaUx_OMV1EQKIwJwh64Ozo"

# 📍 Chemin absolu vers la base de données
DATABASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/bdd_readmuse.db"))

# 📚 Liste des ISBN à ajouter (extrait des top 30 ventes)
ISBN_LIST = [
    "9782290391174", "9782072999994", "9782290391198", "9782221243619",
    "9782246831457", "9782226474971", "9782709674539", "9782824637464",
    "9782743664060", "9782749947204", "9782226470089", "9782213727813",
    "9782493909763", "9782824627571", "9782714499561", "9782258210608",
    "9782226479938", "9782226472731", "9782253248576", "9782380756975",
    "9782266341684", "9782702183694", "9782253249016", "9782266325318",
    "9782266344685", "9782253934103", "9782755669398", "9782253248385",
    "9782755677416", "9782264085245"
]

# 🧠 Extraction des données
def extract_book_data(item):
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
        "Categorie": "Top ventes"
    }

def extract_isbn(identifiers):
    for id in identifiers:
        if id.get("type") in ["ISBN_13", "ISBN_10"]:
            return id.get("identifier")
    return ""

# 🔍 Requête Google Books par ISBN
def fetch_book_by_isbn(isbn):
    url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if "items" in data:
            return extract_book_data(data["items"][0])
    except requests.RequestException as e:
        print(f"⚠️ Erreur pour ISBN {isbn} : {e}")
    return None

# 📥 Insertion
def livre_deja_present(conn, titre, auteur):
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 1 FROM Livres 
        WHERE lower(trim(Titre)) = lower(trim(?)) 
        AND lower(trim(Auteur)) = lower(trim(?))
    """, (titre, auteur))
    return cursor.fetchone() is not None


def insert_books(books):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    livres_inserts = []

    for b in books:
        if not livre_deja_present(conn, b["Titre"], b["Auteur"]):
            livres_inserts.append((
                b["Titre"], b["Auteur"], b["Genre"], b["Resume"],
                b["Date_Publication"], b["Editeur"], b["Nombre_Pages"],
                b["URL_Couverture"], b["ISBN"], b["Categorie"]
            ))

    if livres_inserts:
        cursor.executemany("""
            INSERT INTO Livres 
            (Titre, Auteur, Genre, Resume, Date_Publication, Editeur, Nombre_Pages, URL_Couverture, ISBN, Categorie)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, livres_inserts)
        conn.commit()
        print(f"✅ {len(livres_inserts)} livres insérés.")
    else:
        print("⚠️ Aucun nouveau livre à insérer.")
    
    conn.close()

# 🚀 Exécution principale
if __name__ == "__main__":
    books = []
    for isbn in ISBN_LIST:
        print(f"🔍 Recherche pour ISBN {isbn}")
        book = fetch_book_by_isbn(isbn)
        if book:
            books.append(book)
        else:
            print(f"❌ Introuvable ou erreur pour ISBN {isbn}")

    insert_books(books)

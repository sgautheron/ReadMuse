import sqlite3

DATABASE_PATH = "bdd_readmuse.db"

def get_user_preferences(user_id):
    """Récupère les préférences d'un utilisateur"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT Preferences_Declarees FROM Utilisateurs WHERE ID_Utilisateur = ?", (user_id,))
    result = cursor.fetchone()

    conn.close()
    return result[0] if result else None

def recommend_books(user_id):
    """Recommande des livres en fonction des préférences textuelles"""
    user_prefs = get_user_preferences(user_id)
    
    if not user_prefs:
        return "Aucune préférence trouvée."

    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    query = f"""
        SELECT * FROM Livres
        WHERE Genre LIKE ? OR Mots_Cles LIKE ?
        ORDER BY RANDOM() LIMIT 5
    """
    cursor.execute(query, (f"%{user_prefs}%", f"%{user_prefs}%"))
    recommendations = cursor.fetchall()

    conn.close()
    return recommendations

if __name__ == "__main__":
    user_id_test = 1  # Remplace par un ID réel
    print(recommend_books(user_id_test))

// 🔁 Récupère tous les livres disponibles depuis l’API
export const fetchLivres = async () => {
  try {
    console.log("📡 Tentative de récupération des livres depuis l'API...");
    const response = await fetch("http://127.0.0.1:8000/livres/");

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📚 Données reçues :", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des livres :", error);
    return [];
  }
};

// 📖 Récupère les détails d’un livre spécifique à partir de son ID
export const fetchLivreById = async (id) => {
  try {
    console.log(`📡 Récupération du livre ID ${id}...`);

    const response = await fetch(`http://127.0.0.1:8000/livres/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Erreur API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`📖 Détails du livre reçu (ID ${id}):`, data);
    return data;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération du livre (ID ${id}) :`, error);
    return null;
  }
};

// 🗣️ Récupère les avis (commentaires) associés à un livre donné (via son ID)
export const fetchReviewsByBookId = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/livres/${id}/reviews`);
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des avis :", error);
    return [];
  }
};

// 🌟 Récupère tous les livres triés par popularité décroissante (en fonction du nombre d’interactions)
export const fetchLivresParPopularite = async () => {
  try {
    console.log("📡 Récupération dynamique des livres triés par popularité...");
    const response = await fetch("http://127.0.0.1:8000/livres/tri_popularite");

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des livres triés par popularité :", error);
    return [];
  }
};

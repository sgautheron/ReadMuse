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
  
import React, { useEffect, useState } from "react";
import { fetchLivres } from "../api/livres"; // Import de l'API

const Livres = () => {
  const [livres, setLivres] = useState([]);

  useEffect(() => {
    const getLivres = async () => {
      const data = await fetchLivres();
      setLivres(data);
    };
    getLivres();
  }, []);

  return (
    <div>
      <h1>Liste des Livres</h1>
      <ul>
        {livres.map((livre) => (
          <li key={livre.ID_Livre}>
            <h2>{livre.Titre}</h2>
            <p><strong>Auteur :</strong> {livre.Auteur}</p>
            <p><strong>Genre :</strong> {livre.Genre}</p>
            <p><strong>Résumé :</strong> {livre.Resume}</p>
            {livre.URL_Couverture && (
              <img src={livre.URL_Couverture} alt={livre.Titre} width="100" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Livres;

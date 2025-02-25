import React, { useEffect, useState } from "react";
import { fetchLivres } from "../api/livres";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/Livres.css"; // ✅ Import du CSS

const Livres = () => {
  const [livres, setLivres] = useState([]);
  const [livresParRangée, setLivresParRangée] = useState(1);

  useEffect(() => {
    const getLivres = async () => {
      const data = await fetchLivres();
      setLivres(data);
    };
    getLivres();

    // ✅ Ajustement dynamique du nombre de livres par rangée
    const updateLivresParRangée = () => {
      const largeurEcran = window.innerWidth;
      const livresMax = Math.floor(largeurEcran / 160); // ~150px par livre + marges
      setLivresParRangée(livresMax > 1 ? livresMax : 1);
    };

    updateLivresParRangée();
    window.addEventListener("resize", updateLivresParRangée);

    return () => {
      window.removeEventListener("resize", updateLivresParRangée);
    };
  }, []);

  // 🔥 Découpage dynamique en rangées
  const livresEnRangées = [];
  for (let i = 0; i < livres.length; i += livresParRangée) {
    livresEnRangées.push(livres.slice(i, i + livresParRangée));
  }

  return (
    <Box className="library-container">
      {livresEnRangées.map((rangée, index) => (
        <Box key={index} className="shelf-container">
          {/* 📚 Livres */}
          <Box className="book-row">
            {rangée.map((livre) => (
              <Box key={livre.ID_Livre} className="book-item">
                <Link to={`/livre/${livre.ID_Livre}`} className="book-link">
                  {livre.URL_Couverture && (
                    <img src={livre.URL_Couverture} alt={livre.Titre} className="book-cover" />
                  )}
                </Link>
              </Box>
            ))}
          </Box>
          {/* 🏗️ Étagère alignée exactement avec la rangée */}
          <Box className="shelf" style={{ width: `${rangée.length * 150}px` }}></Box>
        </Box>
      ))}
    </Box>
  );
};

export default Livres;

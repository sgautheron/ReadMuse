import React, { useEffect, useState } from "react";
import { fetchLivres } from "../api/livres";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/Livres.css"; // ✅ Import du CSS

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
    <Box className="library-container">
      {/* 🔥 Gestion des rangées dynamiques */}
      <div className="shelf-container">
        {livres.map((livre) => (
          <Box key={livre.ID_Livre} className="book-item">
            <Link to={`/livre/${livre.ID_Livre}`} className="book-link">
              {livre.URL_Couverture && (
                <img src={livre.URL_Couverture} alt={livre.Titre} className="book-cover" />
              )}
            </Link>
          </Box>
        ))}
      </div>
      {/* ✅ Une seule étagère qui s'étend sous toutes les couvertures */}
      <div className="shelf"></div>
    </Box>
  );
};

export default Livres;

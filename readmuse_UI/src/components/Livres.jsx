import React, { useEffect, useState } from "react";
import { fetchLivres } from "../api/livres";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/Livres.css"; 

const Livres = () => {
  const [livres, setLivres] = useState([]);
  const [livresParRangée, setLivresParRangée] = useState(1);

  useEffect(() => {
    const getLivres = async () => {
      const data = await fetchLivres();
      setLivres(data);
    };
    getLivres();

    const updateLivresParRangée = () => {
      const largeurEcran = window.innerWidth;
      const livresMax = Math.floor(largeurEcran / 160);
      setLivresParRangée(livresMax > 1 ? livresMax : 1);
    };

    updateLivresParRangée();
    window.addEventListener("resize", updateLivresParRangée);

    return () => {
      window.removeEventListener("resize", updateLivresParRangée);
    };
  }, []);

  const livresEnRangées = [];
  let tempRangée = [];

  livres.forEach((livre, index) => {
    tempRangée.push(livre);
    if (tempRangée.length === livresParRangée) {
      livresEnRangées.push(tempRangée);
      tempRangée = [];
    }
  });

  if (tempRangée.length > 0) {
    while (tempRangée.length < livresParRangée) {
      tempRangée.push(null); // Ajouter des espaces vides
    }
    livresEnRangées.push(tempRangée);
  }

  return (
    <Box className="library-container">
      {livresEnRangées.map((rangée, index) => (
        <Box key={index} className="shelf-container">
          {/* 📚 Livres */}
          <Box className="book-row">
          {rangée.map((livre, idx) => (
  <Box
  key={livre ? `livre-${livre.ID_Livre}-${index}-${idx}` : `vide-${index}-${idx}`}
  className="book-item"
  >
    {livre ? (
      <Link to={`/livre/${livre.ID_Livre}`} className="book-link">
        {livre.URL_Couverture && (
          <img src={livre.URL_Couverture} alt={livre.Titre} className="book-cover" />
        )}
      </Link>
    ) : (
      <div className="book-placeholder"></div>
    )}
  </Box>
))}
          </Box>
          <Box className="shelf" style={{ width: `${livresParRangée * 150}px` }}></Box>
        </Box>
      ))}
    </Box>
  );
};

export default Livres;

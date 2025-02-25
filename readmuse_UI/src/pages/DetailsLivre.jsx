import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLivreById } from "../api/livres";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const DétailsLivre = () => {
  const { id } = useParams();
  const [livre, setLivre] = useState(null);

  useEffect(() => {
    const getLivre = async () => {
      const data = await fetchLivreById(id);
      setLivre(data);
    };
    getLivre();
  }, [id]);

  if (!livre) {
    return <Typography textAlign="center">Chargement...</Typography>;
  }

  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {livre.Titre}
      </Typography>
      <Typography variant="h6" color="text.secondary">
        {livre.Auteur}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 3,
        }}
      >
        {livre.URL_Couverture && (
          <img
            src={livre.URL_Couverture}
            alt={livre.Titre}
            style={{
              width: "250px",
              borderRadius: 8,
              boxShadow: "3px 3px 10px rgba(0,0,0,0.2)",
            }}
          />
        )}
        <Typography variant="body1" sx={{ maxWidth: "600px", mt: 3 }}>
          <strong>Résumé :</strong> {livre.Resume}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <strong>Genre :</strong> {livre.Genre}
        </Typography>
        <Button variant="contained" sx={{ mt: 3 }} component={Link} to="/exploration">
          Retour à la bibliothèque
        </Button>
      </Box>
    </Box>
  );
};

export default DétailsLivre;

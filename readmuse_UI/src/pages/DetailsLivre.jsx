import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchLivreById, fetchReviewsByBookId } from "../api/livres";
import { Box, Typography, Button, Paper, Divider, Grow, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DétailsLivre = () => {
  const { id } = useParams();
  const [livre, setLivre] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const pastelColors = [
    "#ffe5ec",
    "#e0f7fa",
    "#f3e5f5",
    "#fff3cd",
    "#d1f7c4",
    "#ffebcc",
    "#cdeffd",
  ];

  const getPastelColor = (str) => {
    const hash = [...str].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return pastelColors[hash % pastelColors.length];
  };

  useEffect(() => {
    const getLivre = async () => {
      const data = await fetchLivreById(id);
      setLivre(data);
    };

    const getReviews = async () => {
      const data = await fetchReviewsByBookId(id);
      setReviews(data);
    };

    getLivre();
    getReviews();
  }, [id]);

  if (!livre) {
    return <Typography textAlign="center">Chargement...</Typography>;
  }

  return (
    <>
      {/* Bouton retour discret */}
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <IconButton onClick={() => navigate("/exploration")} color="primary">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          padding: 4,
          marginTop: "80px",
          maxWidth: "1200px",
          marginX: "auto",
          display: "flex",
          gap: 4,
          alignItems: "flex-start",
        }}
      >
        {/* COLONNE GAUCHE : détails du livre */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {livre.Titre}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {livre.Auteur}
          </Typography>

          {livre.URL_Couverture && (
            <img
              src={livre.URL_Couverture}
              alt={livre.Titre}
              style={{
                width: "180px",
                borderRadius: 8,
                boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
                marginBottom: "16px",
              }}
            />
          )}

          <Typography variant="h6" gutterBottom>
            Résumé
          </Typography>
          <Paper
            elevation={0}
            sx={{
              padding: 2,
              backgroundColor: "#fafafa",
              border: "1px solid #eee",
              borderRadius: 2,
              fontSize: "0.95rem",
            }}
          >
            <Typography variant="body2">{livre.Resume}</Typography>
          </Paper>
        </Box>

        {/* COLONNE DROITE : mots-clés + avis */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Mots-clés associés
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {livre.Mots_Cles &&
              livre.Mots_Cles.split(",").map((mot, index) => (
                <Grow in key={index} timeout={300 + index * 80}>
                  <Link to={`/motcle/${mot.trim()}`} style={{ textDecoration: "none" }}>
                    <Paper
                      sx={{
                        px: 2,
                        py: 1,
                        backgroundColor: getPastelColor(mot),
                        color: "#333",
                        borderRadius: "999px",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        transition: "0.3s",
                        ":hover": {
                          opacity: 0.85,
                          cursor: "pointer",
                        },
                      }}
                    >
                      {mot.trim()}
                    </Paper>
                  </Link>
                </Grow>
              ))}
          </Box>

          <Typography variant="h6" gutterBottom>
            Avis des lecteurs
          </Typography>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Paper key={index} sx={{ padding: 2, my: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {review.utilisateur}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(review.date).toLocaleDateString()}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1">{review.commentaire}</Typography>
              </Paper>
            ))
          ) : (
            <Typography color="text.secondary">Aucun avis pour ce livre.</Typography>
          )}

          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("/formulaire")}>
            Laisser un avis
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default DétailsLivre;

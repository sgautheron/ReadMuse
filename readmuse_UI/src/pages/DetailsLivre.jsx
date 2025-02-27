import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchLivreById, fetchReviewsByBookId } from "../api/livres";
import { Box, Typography, Button, Tabs, Tab, Paper, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const DétailsLivre = () => {
  const { id } = useParams();
  const [livre, setLivre] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const getLivre = async () => {
      const data = await fetchLivreById(id);
      console.log("📢 Données reçues par React :", data);
      setLivre(data);
    };

    const getReviews = async () => {
      const data = await fetchReviewsByBookId(id);
      console.log("📢 Revues reçues :", data);
      setReviews(data);
    };

    getLivre();
    getReviews();
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

      {/* 📌 Onglets Détails / Avis */}
      <Paper sx={{ mt: 3, mb: 4 }}>
        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} centered>
          <Tab label="📖 Détails du livre" />
          <Tab label="📝 Avis des lecteurs" />
        </Tabs>
      </Paper>

      {/* 🔄 Contenu des onglets */}
      {tabIndex === 0 ? (
        <Box sx={{ maxWidth: "600px", margin: "auto", textAlign: "left" }}>
          {livre.URL_Couverture && (
            <img
              src={livre.URL_Couverture}
              alt={livre.Titre}
              style={{
                width: "250px",
                borderRadius: 8,
                boxShadow: "3px 3px 10px rgba(0,0,0,0.2)",
                display: "block",
                margin: "auto",
              }}
            />
          )}
          <Typography variant="body1" sx={{ mt: 3 }}>
            <strong>Résumé :</strong> {livre.Resume}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">
            <strong>Genre :</strong> {livre.Genre}
          </Typography>
          <Typography variant="body2">
            <strong>Date de publication :</strong> {livre.Date_Publication}
          </Typography>
          <Typography variant="body2">
            <strong>Éditeur :</strong> {livre.Editeur}
          </Typography>
          <Typography variant="body2">
            <strong>Nombre de pages :</strong> {livre.Nombre_Pages}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ maxWidth: "600px", margin: "auto", textAlign: "left" }}>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Paper key={index} sx={{ padding: 2, my: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {review.utilisateur}
                </Typography>
                <Typography variant="body2">{review.commentaire}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              Aucun avis pour ce livre. Soyez le premier à en laisser un !
            </Typography>
          )}
        </Box>
      )}

      <Button variant="contained" sx={{ mt: 3 }} component={Link} to="/exploration">
        Retour à la bibliothèque
      </Button>
    </Box>
  );
};

export default DétailsLivre;

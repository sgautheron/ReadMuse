import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchLivreById, fetchReviewsByBookId } from "../api/livres";
import { Box, Typography, Button, Paper, Divider, Grow, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUser } from "../context/UserContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const DétailsLivre = () => {
  const { id } = useParams();
  const [livre, setLivre] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [motsClesAvis, setMotsClesAvis] = useState([]);
  const navigate = useNavigate();
  const { utilisateur } = useUser();
  const [isFavori, setIsFavori] = useState(false);

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

    const getMotsCles = async () => {
      const res = await fetch(`http://127.0.0.1:8000/livres/${id}/motcles_avis`);
      const data = await res.json();
      setMotsClesAvis(data.motcles);
    };

    getLivre();
    getReviews();
    getMotsCles();

    if (utilisateur) {
      fetch(`http://127.0.0.1:8000/favoris/${utilisateur.ID_Utilisateur}`)
        .then((res) => res.json())
        .then((data) => {
          const favoriTrouvé = data.some((fav) => fav.ID_Livre === parseInt(id));
          setIsFavori(favoriTrouvé);
        })
        .catch(() => setIsFavori(false));
    }
  }, [id]);

  const handleToggleFavori = async () => {
    if (!utilisateur) {
      navigate("/login");
      return;
    }

    const url = `http://127.0.0.1:8000/favoris/${utilisateur.ID_Utilisateur}/${id}`;

    if (isFavori) {
      await fetch(url, { method: "DELETE" });
      setIsFavori(false);
    } else {
      await fetch(
        `http://127.0.0.1:8000/favoris/?id_utilisateur=${utilisateur.ID_Utilisateur}&id_livre=${id}`,
        { method: "POST" }
      );
      setIsFavori(true);
    }
  };

  if (!livre) {
    return <Typography textAlign="center">Chargement...</Typography>;
  }

  return (
    <>
      <Box sx={{ position: "absolute", top: 120, left: 80 }}>
        <IconButton onClick={() => navigate("/exploration-emo")} color="primary">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          padding: 4,
          marginTop: "100px",
          maxWidth: "1500px",
          marginX: "auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        {/* Détails */}
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {livre.Titre}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {livre.Auteur}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            {livre.URL_Couverture && (
              <img
                src={livre.URL_Couverture}
                alt={livre.Titre}
                style={{
                  width: "180px",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
                }}
              />
            )}
            <Button
              onClick={handleToggleFavori}
              startIcon={isFavori ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              sx={{ mt: 2, ml: 3 }}
            >
              {isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Button>
          </Box>

          <Typography variant="h5" gutterBottom>
            Résumé
          </Typography>
          <Paper sx={{ padding: 2, my: 2 }}>
            <Typography variant="body1">{livre.Resume}</Typography>
          </Paper>
        </Box>

        {/* Mots-clés & avis */}
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography variant="h5" gutterBottom>
            Mots-clés issus des avis
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {motsClesAvis.length > 0 ? (
              motsClesAvis.map((mot, index) => (
                <Grow in key={index} timeout={300 + index * 80}>
                  <Link to={`/motcle/${mot}`} style={{ textDecoration: "none" }}>
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
                      {mot}
                    </Paper>
                  </Link>
                </Grow>
              ))
            ) : (
              <Typography color="text.secondary">
                Aucun mot-clé issu des avis pour ce livre.
              </Typography>
            )}
          </Box>

          <Typography variant="h5" gutterBottom>
            Avis des lecteurs
          </Typography>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Paper key={index} sx={{ padding: 2, my: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  <Link
                    to={`/utilisateur/${review.utilisateur_id}`}
                    style={{ textDecoration: "none" }}
                  >
                    {review.utilisateur}
                  </Link>
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

          <Button sx={{ mt: 2 }} onClick={() => navigate("/formulaire")}>
            Laisser un avis
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default DétailsLivre;

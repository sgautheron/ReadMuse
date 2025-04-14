// Imports nécessaires : hooks React, composants Material UI, navigation, contextes
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Divider, Button, Chip } from "@mui/material";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

// Composant principal : affiche les favoris et l'historique de lecture de l'utilisateur
const Bibliotheque = () => {
  const { utilisateur } = useUser(); // Accès à l'utilisateur connecté via le contexte
  const navigate = useNavigate(); // Pour rediriger si non connecté
  const [favoris, setFavoris] = useState([]); // Liste des livres en favoris
  const [interactions, setInteractions] = useState([]); // Historique d'interactions (avis, lectures, etc.)

  // Chargement initial : vérifie l'authentification et récupère les données depuis l'API
  useEffect(() => {
    // Si utilisateur non connecté, redirection vers la page de login
    if (!utilisateur) {
      navigate("/login");
      return;
    }

    // Fonction pour appeler l'API et stocker les favoris et interactions
    const fetchData = async () => {
      try {
        const [resFavoris, resInteractions] = await Promise.all([
          fetch(`http://127.0.0.1:8000/favoris/${utilisateur.ID_Utilisateur}`),
          fetch(`http://127.0.0.1:8000/interactions/${utilisateur.ID_Utilisateur}`),
        ]);
        const dataFavoris = await resFavoris.json();
        const dataInteractions = await resInteractions.json();

        setFavoris(dataFavoris);
        setInteractions(dataInteractions);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData(); // Appel effectif
  }, [utilisateur, navigate]);

  // Affichage principal du composant
  return (
    <Box sx={{ px: 4, pt: 10 }}>
      {/* 🏷️ Titre principal */}
      <Typography variant="h4" gutterBottom>
        Ma Bibliothèque
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Section favoris */}
      <Typography variant="h5" gutterBottom>
        Mes livres favoris
      </Typography>

      {/* Si aucun favori → message informatif */}
      {favoris.length === 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography color="text.secondary">Aucun livre ajouté aux favoris.</Typography>
        </Box>
      ) : (
        // Sinon → affichage en grille des cartes de livres favoris
        <Grid container spacing={3}>
          {favoris.map((livre) => (
            <Grid item key={livre.ID_Livre} xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: "center", height: "100%" }}>
                {/* Image de couverture du livre */}
                {livre.URL_Couverture && (
                  <img
                    src={livre.URL_Couverture}
                    alt={livre.Titre}
                    style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
                  />
                )}
                {/* Titre et auteur */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                  {livre.Titre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {livre.Auteur}
                </Typography>

                {/* Bouton vers la page détail du livre */}
                <Button
                  component={Link}
                  to={`/livre/${livre.ID_Livre}`}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Voir
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Section historique de lecture */}
      <Typography variant="h5" gutterBottom>
        Mon historique de lectures
      </Typography>

      {/* Si aucune interaction → message d'information */}
      {interactions.length === 0 ? (
        <Typography color="text.secondary">Aucune interaction enregistrée.</Typography>
      ) : (
        // Sinon → affichage des interactions sous forme de liste de Paper
        interactions.map((item) => (
          <Paper key={item.ID_Interaction} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">{item.Titre}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(item.Date_Interaction).toLocaleDateString()}
            </Typography>
            <Typography sx={{ mt: 1 }}>{item.Description}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

// Export du composant pour l’utiliser dans le routeur
export default Bibliotheque;

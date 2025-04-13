import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Divider, Button, Chip } from "@mui/material";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

const Bibliotheque = () => {
  const { utilisateur } = useUser();
  const navigate = useNavigate();
  const [favoris, setFavoris] = useState([]);
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    if (!utilisateur) {
      navigate("/login");
      return;
    }

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

    fetchData();
  }, [utilisateur, navigate]);

  return (
    <Box sx={{ px: 4, pt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Ma Bibliothèque
      </Typography>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>
        Mes livres favoris
      </Typography>

      {favoris.length === 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography color="text.secondary">Aucun livre ajouté aux favoris.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favoris.map((livre) => (
            <Grid item key={livre.ID_Livre} xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: "center", height: "100%" }}>
                {livre.URL_Couverture && (
                  <img
                    src={livre.URL_Couverture}
                    alt={livre.Titre}
                    style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
                  />
                )}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                  {livre.Titre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {livre.Auteur}
                </Typography>
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
      <Typography variant="h5" gutterBottom>
        Mon historique de lectures
      </Typography>
      {interactions.length === 0 ? (
        <Typography color="text.secondary">Aucune interaction enregistrée.</Typography>
      ) : (
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

export default Bibliotheque;

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Paper, Chip, Divider } from "@mui/material";

function Recommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommandations, setRecommandations] = useState([]);
  const [description, setDescription] = useState("");
  const [livreDecrit, setLivreDecrit] = useState(null);

  useEffect(() => {
    const idStocke = localStorage.getItem("livre_decrit");
    if (idStocke) {
      setLivreDecrit(parseInt(idStocke));
      localStorage.removeItem("livre_decrit"); // Nettoyage après usage
    }

    const stored = localStorage.getItem("recommandations");
    if (stored) {
      setRecommandations(JSON.parse(stored));
    }
    if (location.state?.description) {
      setDescription(location.state.description);
    }
  }, [location]);

  const handleMotCleClick = (mot) => {
    navigate(`/explorer-motcle/${encodeURIComponent(mot)}`);
  };

  return (
    <Box sx={{ p: 10, mt: 3 }}>
      <Typography variant="h4" mb={3}>
        Vos recommandations
      </Typography>

      {description && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            À partir de votre description :
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 4, backgroundColor: "#f9f9f9" }}>
            <Typography variant="body1">{description}</Typography>
          </Paper>
        </>
      )}

      {recommandations.length === 0 ? (
        <Typography>Aucune recommandation pour l’instant.</Typography>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Connectez-vous pour sauvegarder vos recommandations et accéder à des suggestions encore
            plus personnalisées.
          </Typography>

          <Grid container spacing={3}>
            {recommandations
              .filter((livre) => livre.ID_Livre !== livreDecrit)
              .map((livre) => (
                <Grid item xs={12} sm={6} md={4} key={livre.ID_Livre}>
                  <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                    <Typography variant="h6" gutterBottom>
                      {livre.Titre}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {livre.Auteur}
                    </Typography>

                    <Box
                      sx={{
                        width: "100%",
                        height: 180,
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <img
                        src={livre.URL_Couverture}
                        alt={`Couverture de ${livre.Titre}`}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                          borderRadius: 8,
                        }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Compatibilité de {(livre.Score * 100).toFixed(2)} %
                    </Typography>

                    {livre.Score > 0.6 && (
                      <Chip label="❤️ Coup de cœur" size="small" color="secondary" sx={{ mt: 1 }} />
                    )}

                    <Divider sx={{ my: 1 }} />

                    {livre.Mots_Commun && livre.Mots_Commun.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          Mots-clés partagés :
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                          {livre.Mots_Commun.map((mot, index) => (
                            <Chip
                              key={index}
                              label={mot}
                              size="small"
                              onClick={() => handleMotCleClick(mot)}
                              clickable
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

export default Recommendations;

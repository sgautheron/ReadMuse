import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Grid, Paper, Chip, Divider } from "@mui/material";

function Recommendations() {
  const location = useLocation();
  const [recommandations, setRecommandations] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("recommandations");
    if (stored) {
      setRecommandations(JSON.parse(stored));
    }
    if (location.state?.description) {
      setDescription(location.state.description);
    }
  }, [location]);

  return (
    <Box sx={{ p: 10 }}>
      <Typography variant="h4" mb={3}></Typography>

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
        <Grid container spacing={3}>
          {recommandations.map((livre) => (
            <Grid item xs={12} sm={6} md={4} key={livre.id}>
              <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  {livre.titre}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Score : {livre.score}
                </Typography>

                <Divider sx={{ my: 1 }} />

                {/* Affichage des thèmes partagés regroupés */}
                {livre.themes_partagés &&
                  Object.entries(livre.themes_partagés).map(([theme, mots]) => (
                    <Box key={theme} sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)} :
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {Array.isArray(mots) &&
                          mots.map((mot, index) => (
                            <Chip key={index} label={mot} size="small" variant="outlined" />
                          ))}
                      </Box>
                    </Box>
                  ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Recommendations;

//auteur, clic, image, clic sur les mots clés, message pour inciter à se connecter

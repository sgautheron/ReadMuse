import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Box, Typography, Grid, Paper, Chip, Divider, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Recommendations() {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommandations, setRecommandations] = useState([]);
  const [description, setDescription] = useState("");
  const [livreDecrit, setLivreDecrit] = useState(null);
  const [livreSource, setLivreSource] = useState(null);

  useEffect(() => {
    const idStocke = localStorage.getItem("livre_decrit");
    if (idStocke) {
      const id = parseInt(idStocke);
      setLivreDecrit(id);
      localStorage.removeItem("livre_decrit");

      fetch(`http://localhost:8000/livres/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setLivreSource(data);
        })
        .catch((err) => {
          console.error("Erreur récupération livre source :", err);
        });
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
    navigate(`/motcle/${encodeURIComponent(mot)}`);
  };

  return (
    <>
      {/* Bouton retour */}
      <Box sx={{ position: "absolute", top: 120, left: 80 }}>
        <IconButton onClick={() => navigate("/formulaire")} color="primary">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Contenu principal */}
      <Box sx={{ p: 10, mt: 3 }}>
        <Typography variant="h4" mb={3}>
          Vos recommandations
        </Typography>

        {description && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              À partir de votre description
              {livreSource && (
                <>
                  {" "}
                  de <strong>{livreSource.Titre}</strong> par <em>{livreSource.Auteur}</em>
                </>
              )}
              :
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
              Connectez-vous pour sauvegarder vos recommandations et accéder à des suggestions
              encore plus personnalisées.
            </Typography>

            <Grid container spacing={3}>
              {recommandations
                .filter((livre) => livre.ID_Livre !== livreDecrit)
                .map((livre) => (
                  <Grid item xs={12} sm={6} md={4} key={livre.ID_Livre}>
                    <Link
                      to={`/livre/${livre.ID_Livre}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Paper
                        elevation={3}
                        sx={{
                          p: 2,
                          height: "100%",
                          transition: "transform 0.3s",
                          "&:hover": { transform: "scale(1.03)", cursor: "pointer" },
                        }}
                      >
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
                          <Chip
                            label="❤️ Coup de cœur"
                            size="small"
                            color="secondary"
                            sx={{ mt: 1 }}
                          />
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
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleMotCleClick(mot);
                                  }}
                                  clickable
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Paper>
                    </Link>
                  </Grid>
                ))}
            </Grid>
          </>
        )}
      </Box>
    </>
  );
}

export default Recommendations;

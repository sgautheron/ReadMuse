// Hooks & Routing
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

// UI avec Material UI
import { Box, Typography, Grid, Paper, Chip, Divider, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Recommendations() {
  const location = useLocation(); // Pour récupérer les infos passées depuis le formulaire
  const navigate = useNavigate(); // Pour naviguer

  // États
  const [recommandations, setRecommandations] = useState([]); // Livres recommandés
  const [description, setDescription] = useState(""); // Texte saisi par l'utilisateur
  const [livreDecrit, setLivreDecrit] = useState(null); // ID du livre dont on a parlé
  const [livreSource, setLivreSource] = useState(null); // Métadonnées du livre source

  // Effet au chargement
  useEffect(() => {
    // Récupération de l’ID du livre source depuis le localStorage
    const idStocke = localStorage.getItem("livre_decrit");
    if (idStocke) {
      const id = parseInt(idStocke);
      setLivreDecrit(id);
      localStorage.removeItem("livre_decrit");

      // Récupération des infos du livre source
      fetch(`http://localhost:8000/livres/${id}`)
        .then((res) => res.json())
        .then((data) => setLivreSource(data))
        .catch((err) => console.error("Erreur récupération livre source :", err));
    }

    // Récupération des recommandations stockées
    const stored = localStorage.getItem("recommandations");
    if (stored) {
      setRecommandations(JSON.parse(stored));
    }

    // Récupération de la description passée par le formulaire
    if (location.state?.description) {
      setDescription(location.state.description);
    }
  }, [location]);

  // Clique sur un mot-clé partagé pour ouvrir la page associée
  const handleMotCleClick = (mot) => {
    navigate(`/motcle/${encodeURIComponent(mot)}`);
  };

  return (
    <>
      {/* Bouton retour en haut à gauche */}
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

        {/* Description utilisateur + livre source */}
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

        {/* Pas de recommandations trouvées */}
        {recommandations.length === 0 ? (
          <Typography>Aucune recommandation pour l’instant.</Typography>
        ) : (
          <>
            {/* Astuce UX : incite à se connecter */}
            <Typography variant="body2" color="text.secondary" mb={2}>
              Connectez-vous pour sauvegarder vos recommandations et accéder à des suggestions
              encore plus personnalisées.
            </Typography>

            {/* Grille des livres recommandés */}
            <Grid container spacing={3}>
              {recommandations
                .filter((livre) => livre.ID_Livre !== livreDecrit) // Ne pas réafficher le livre déjà commenté
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

                        {/* Image de couverture */}
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

                        {/* Score de compatibilité */}
                        <Typography variant="body2" color="text.secondary">
                          Compatibilité de {(livre.Score * 100).toFixed(2)} %
                        </Typography>

                        {/* Badge coup de cœur */}
                        {livre.Score > 0.6 && (
                          <Chip
                            label="❤️ Coup de cœur"
                            size="small"
                            color="secondary"
                            sx={{ mt: 1 }}
                          />
                        )}

                        <Divider sx={{ my: 1 }} />

                        {/* Mots-clés en commun */}
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
                                    e.preventDefault(); // Empêche l’ouverture du lien parent
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

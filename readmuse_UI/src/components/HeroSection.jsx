import { Box, Container, Grid, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import backgroundImage from "../assets/bibliotheque.jpg";
import { useEffect, useState } from "react";
import axios from "axios";

const HeroSection = () => {
  const theme = useTheme();

  const [topCommentes, setTopCommentes] = useState([]);
  const reviews = [
    {
      nom: "Camille",
      texte:
        "Un outil génial pour découvrir des livres en fonction de mes goûts. J’ai trouvé deux pépites dès ma première description !",
    },
    {
      nom: "Julien",
      texte: "L’analyse est bluffante. On se sent compris dans notre manière d’aimer lire.",
    },
    {
      nom: "Leïla",
      texte:
        "J’adore l’esthétique du site et le fait que les recommandations soient basées sur des ressentis !",
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8000/livres/top-commentes") // 🔁 adapte si besoin
      .then((res) => setTopCommentes(res.data))
      .catch((err) => console.error("Erreur chargement livres commentés", err));
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* SECTION PRINCIPALE */}
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Colonne gauche */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5 }}
          style={{
            width: "35%",
            backgroundColor: theme.palette.background.default,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h1" fontWeight="bold" gutterBottom>
            ReadMuse
          </Typography>
          <Typography variant="body1" mb={3}>
            Découvrez des recommandations littéraires personnalisées. Trouvez votre prochain livre
            en quelques clics grâce à vos préférences de lecture !
          </Typography>
        </motion.div>

        {/* Colonne droite */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5 }}
          style={{
            flex: 1,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              maxWidth: 400,
              width: "100%",
            }}
          >
            {/* CARD 1 */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "#f7f3e9",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Exprimez ce que vous aimez
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Décrivez un livre que vous avez aimé, et recevez des suggestions personnalisées.
              </Typography>
              <Button component={Link} to="/formulaire" variant="contained">
                Essayer
              </Button>
            </Paper>

            {/* CARD 2 */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "#f7f3e9",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Explorez notre bibliothèque
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Parcourez les livres par catégorie ou mots-clés. Cliquez sur ce qui vous inspire !
              </Typography>
              <Button component={Link} to="/exploration-emo" variant="contained">
                Explorer
              </Button>
            </Paper>

            {/* CARD 3 */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "#f7f3e9",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Rejoignez votre cercle de lecture
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Connectez-vous pour enregistrer vos préférences et suivre d'autres lecteurs.
              </Typography>
              <Button component={Link} to="/login" variant="contained">
                Se connecter
              </Button>
            </Paper>
          </Box>
        </motion.div>
      </Box>

      {/* LIVRES LES PLUS COMMENTÉS */}
      {topCommentes.length > 0 && (
        <Container sx={{ py: 6 }}>
          <Typography variant="h5" fontWeight="bold" mb={3} mt={3}>
            Les livres les plus commentés
          </Typography>
          <Grid container spacing={4}>
            {topCommentes.slice(0, 3).map((livre) => (
              <Grid item xs={12} sm={4} key={livre.ID_Livre}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    backgroundColor: "#fdfaf3",
                    borderRadius: 2,
                    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.03)", cursor: "pointer" },
                  }}
                >
                  <img
                    src={livre.URL_Couverture || "/placeholder.jpg"}
                    alt={livre.Titre}
                    style={{
                      width: "35%",
                      height: "auto",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {livre.Titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {livre.Auteur}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* AVIS UTILISATEURS */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Ce que pensent nos lecteurs
        </Typography>
        <Grid container spacing={3}>
          {reviews.map((r, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Paper
                elevation={3}
                sx={{
                  backgroundColor: "#fdfaf3",
                  padding: 3,
                  borderRadius: 2,
                  fontStyle: "italic",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Typography variant="body1">“{r.texte}”</Typography>
                <Typography variant="body2" fontWeight="bold" mt={2}>
                  — {r.nom}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;

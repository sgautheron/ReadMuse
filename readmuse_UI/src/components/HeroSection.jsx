import { Box, Container, Grid, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import backgroundImage from "../assets/bibliotheque.jpg";

const HeroSection = () => {
  const theme = useTheme();

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

  return (
    <Box
      sx={{ width: "100vw", minHeight: "100vh", backgroundColor: theme.palette.background.default }}
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

        {/* Colonne droite*/}
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
          }}
        >
          <Container>
            <Grid container spacing={3} direction="column" alignItems="center">
              <Grid item>
                <Button
                  variant="contained"
                  component={Link}
                  to="/formulaire"
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.navbar,
                    borderRadius: "20px",
                    width: "300px",
                    height: "80px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
                    "&:hover": { backgroundColor: "#e3ddd2" },
                  }}
                >
                  Décrire un livre
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  component={Link}
                  to="/exploration-emo"
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.navbar,
                    borderRadius: "20px",
                    width: "300px",
                    height: "80px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
                    "&:hover": { backgroundColor: "#e3ddd2" },
                  }}
                >
                  Explorer les livres
                </Button>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>

      {/* COMMENT ÇA MARCHE */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Comment ça marche ?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "#f7f3e9",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Exprimez ce que vous aimez
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Décrivez un livre que vous avez aimé, et recevez des suggestions personnalisées.
              </Typography>
              <Button
                component={Link}
                to="/formulaire"
                sx={{
                  mt: 2,
                }}
              >
                Essayer
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "#f7f3e9",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Explorez notre bibliothèque
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Parcourez les livres par catégorie ou mots-clés. Cliquez sur ce qui vous inspire !
              </Typography>
              <Button component={Link} to="/exploration-emo" sx={{ mt: 2 }}>
                Explorer
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: "#f7f3e9",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Rejoignez votre club de lecture
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Connectez-vous pour enregistrer vos préférences et suivre d'autres lecteurs.
              </Typography>
              <Button component={Link} to="/login" sx={{ mt: 2 }}>
                Se connecter
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
                  backgroundColor: "#f7f3e9",
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

import { Box, Container, Grid, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import backgroundImage from "../assets/bibliotheque.jpg";
import { useState } from "react";
import InfoModal from "./InfoModal";

function HeroSection() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Partie Gauche*/}
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
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          ReadMuse
        </Typography>
        <Typography variant="body1" mb={3}>
          Découvrez des recommandations littéraires personnalisées. Trouvez votre prochain livre en quelques clics grâce à vos préférences de lecture !
        </Typography>
        <Button variant="contained" sx={{ bgcolor: theme.palette.primary.main, color: "#fff", px: 4 }} onClick={handleOpen}>
          En savoir plus
        </Button>
      </motion.div>

      {/* Partie Droite*/}
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
        width: "400px",
        height: "100px",
        backgroundColor: "#EADDC5", // ✅ Beige clair
        color: "#5A3E2B", // ✅ Texte marron foncé
        fontSize: "1.1rem",
        fontWeight: "bold",
        borderRadius: "20px", // ✅ Coins arrondis
        boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)", // ✅ Effet de profondeur
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#D4C4A8", // ✅ Teinte plus foncée au survol
          transform: "scale(1.05)", // ✅ Effet de zoom
        },
      }}
    >
      Décrire mes préférences
    </Button>
  </Grid>

  {/* Bouton "Explorer les livres" */}
  <Grid item>
    <Button
      variant="contained"
      component={Link}
      to="/exploration"
      sx={{
        width: "400px",
        height: "100px",
        backgroundColor: "#EADDC5",
        color: "#5A3E2B",
        fontSize: "1.1rem",
        fontWeight: "bold",
        borderRadius: "20px",
        boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#D4C4A8",
          transform: "scale(1.05)",
        },
      }}
    >
      Explorer les livres
    </Button>
  </Grid>
</Grid>

        </Container>
      </motion.div>

      
      <InfoModal open={open} handleClose={handleClose} />
    </Box>
  );
}

export default HeroSection;

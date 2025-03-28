import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e2823d", // Orange
    },
    secondary: {
      main: "#C09CFC", // Violet
    },
    background: {
      default: "#F5F0E6", // Fond clair
    },
    text: {
      primary: "#333333", // Texte principal
      secondary: "#666666", // Texte secondaire
      navbar: "#4B3F2F", // Marron foncé pour  navbar et  boutons
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Police principale
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Boutons arrondis
          textTransform: "none", // Pas de majuscules automatiques
          padding: "10px 20px", // Padding des boutons
          transition: "all 0.3s ease", // Effet de transition fluide
          color: "#4B3F2F", // Marron foncé pour le texte des boutons
          "&:hover": {
            backgroundColor: "#C09CFC", // Couleur de hover pour les boutons
            color: "#ffffff", // Texte blanc au hover
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#F5F0E6", // ✅ Fond clair pour la navbar
          color: "#4B3F2F", // ✅ Texte de la navbar en marron foncé
        },
      },
    },
  },
});

export default theme;

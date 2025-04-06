import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e2823d", // Orange doux
    },
    secondary: {
      main: "#8ECAE6", // Bleu pastel
    },
    background: {
      default: "#F5F0E6", // Beige clair
      paper: "#fdfaf5", // Fond des cartes
    },
    text: {
      primary: "#2E2E2E", // Noir doux
      secondary: "#666666", // Texte secondaire
      navbar: "#4B3F2F", // Marron foncé pour la navbar
    },
    accent: {
      main: "#C09CFC", // Violet doux (pour hover, pastilles, etc.)
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1.6rem", fontWeight: 600 },
    body1: { fontSize: "1rem" },
    button: { fontWeight: 600, fontSize: "1rem" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Plus doux
          textTransform: "none",
          padding: "10px 24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          color: "#4B3F2F",
          "&:hover": {
            backgroundColor: "#e7dcd1", // Hover beige plus foncé
            color: "#000",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(245, 240, 230, 0.9)", // même fond que navbar custom
          backdropFilter: "blur(6px)",
          color: "#4B3F2F",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            padding: "10px 20px",
            transition: "all 0.3s ease",
            backgroundColor: "#F5F0E6", // Couleur fond par défaut (beige clair)
            color: "#4B3F2F", // Couleur du texte (marron foncé)
            boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#e3ddd2",
              color: "#4B3F2F", // 👉 fixe la couleur du texte au hover
            },
          },
        },
      },
    },
  },
});

export default theme;

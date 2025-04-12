import { AppBar, Toolbar, IconButton, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../context/UserContext";

function Navbar() {
  const theme = useTheme();
  const { utilisateur, setUtilisateur } = useUser();

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        px: { xs: 2, md: 4 }, // ✅ petites marges sur les côtés
        py: 1, // marge verticale interne
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(245, 240, 230, 0.95)",
        color: theme.palette.text.navbar,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
        {/* Logo + Titre */}
        <Box display="flex" alignItems="center">
          <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/">
            <LibraryBooksIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1, fontFamily: "'Poppins', sans-serif" }}>
            ReadMuse
          </Typography>
        </Box>

        {/* Liens de navigation */}
        <Box display="flex" gap={3.5}>
          <Button startIcon={<HomeIcon />} component={Link} to="/" sx={{ mt: 2, mb: 2 }}>
            Accueil
          </Button>
          <Button
            startIcon={<AssignmentIcon />}
            component={Link}
            to="/formulaire"
            sx={{ mt: 2, mb: 2 }}
          >
            Formulaire
          </Button>
          <Button
            startIcon={<AutoStoriesIcon />}
            component={Link}
            to="/exploration-emo"
            sx={{ mt: 2, mb: 2 }}
          >
            Exploration
          </Button>
          <Button
            startIcon={<LibraryBooksIcon />}
            component={Link}
            to="/motscles"
            sx={{ mt: 2, mb: 2 }}
          >
            Mots-Clés
          </Button>
          {utilisateur && (
            <Button startIcon={<HistoryIcon />} component={Link} to="/profil" sx={{ mt: 2, mb: 2 }}>
              Profil
            </Button>
          )}
        </Box>

        {/* Connexion / Déconnexion */}
        <Box display="flex" alignItems="center" gap={2}>
          {utilisateur ? (
            <>
              <Button
                startIcon={<LogoutIcon />}
                sx={{ mt: 2, mb: 2 }}
                onClick={() => {
                  localStorage.removeItem("utilisateur");
                  setUtilisateur(null);
                }}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <Button startIcon={<LoginIcon />} sx={{ mt: 2, mb: 2 }} component={Link} to="/login">
              Connexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

const navBtnStyle = (theme) => ({
  color: theme.palette.text.navbar,
  borderRadius: 2,
  px: 2,
  fontWeight: 500,
  backgroundColor: "transparent",
  transition: "all 0.3s ease",
  fontFamily: "'Poppins', sans-serif",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    color: theme.palette.text.primary,
  },
});

export default Navbar;

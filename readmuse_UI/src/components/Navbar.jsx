import { AppBar, Toolbar, IconButton, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../context/UserContext"; // ✅

function Navbar() {
  const theme = useTheme();
  const { utilisateur, setUtilisateur } = useUser(); // ✅

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: theme.palette.background.default,
        width: "100%",
        color: theme.palette.text.navbar,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo + Titre */}
        <Box display="flex" alignItems="center">
          <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/">
            <LibraryBooksIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            ReadMuse
          </Typography>
        </Box>

        {/* Liens de navigation */}
        <Box display="flex" gap={2}>
          <Button startIcon={<HomeIcon />} component={Link} to="/">
            Accueil
          </Button>
          <Button startIcon={<AssignmentIcon />} component={Link} to="/formulaire">
            Formulaire
          </Button>
          <Button startIcon={<AutoStoriesIcon />} component={Link} to="/exploration">
            Exploration
          </Button>
          <Button startIcon={<HistoryIcon />} component={Link} to="/historique">
            Historique
          </Button>
          <Button startIcon={<InfoIcon />} component={Link} to="/about">
            À Propos
          </Button>
        </Box>

        {/* ✅ Connexion / Déconnexion */}
        <Box display="flex" alignItems="center" gap={2}>
          {utilisateur ? (
            <>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Bonjour, {utilisateur.Nom}
              </Typography>
              <Button
                startIcon={<LogoutIcon />}
                color="inherit"
                onClick={() => setUtilisateur(null)}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <Button startIcon={<LoginIcon />} color="inherit" component={Link} to="/login">
              Connexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

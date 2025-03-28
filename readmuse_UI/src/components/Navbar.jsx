import { AppBar, Toolbar, IconButton, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

function Navbar() {
  const theme = useTheme();

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
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

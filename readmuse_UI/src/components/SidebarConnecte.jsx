// 🧱 Imports nécessaires : composants Material UI, navigation, contextes utilisateur et sidebar
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useSidebar } from "../context/SidebarContext.jsx";

// Icônes pour les différents éléments du menu
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookIcon from "@mui/icons-material/Book";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

// 📚 Composant de barre latérale pour un utilisateur connecté
const SidebarConnecte = () => {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages
  const { utilisateur } = useUser(); // Récupère l'utilisateur via le contexte
  const { isSidebarOpen, toggleSidebar } = useSidebar(); // Récupère l’état d’ouverture de la sidebar

  // Si aucun utilisateur connecté, ne rien afficher
  if (!utilisateur) return null;

  // 🧭 Définition des éléments de menu et leurs routes associées
  const menuItems = [
    { text: "Mon Profil", icon: <PersonIcon />, path: "/profil" },
    { text: "Mon Cercle", icon: <FavoriteIcon />, path: "/mon-cercle" },
    { text: "Mes Recos", icon: <BookIcon />, path: "/recommandations" },
    { text: "Ma bibliothèque", icon: <HistoryEduIcon />, path: "/bibliotheque" },
  ];

  // 🧱 Rendu visuel de la barre latérale
  return (
    <Box
      sx={{
        width: isSidebarOpen ? 230 : 70, // Largeur variable selon l’état (ouverte/fermée)
        height: "100vh",
        position: "fixed",
        top: "100px",
        left: 0,
        backgroundColor: "#f5f0e6",
        boxShadow: "2px 0 6px rgba(0,0,0,0.05)",
        zIndex: 10,
        transition: "width 0.3s ease",
        overflowX: "hidden",
      }}
    >
      {/* 🔁 Bouton pour ouvrir/fermer la sidebar */}
      <IconButton onClick={toggleSidebar} sx={{ ml: 1, mt: 1 }}>
        {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>

      {/* 📄 Liste des éléments de navigation */}
      <List>
        {menuItems.map((item) => (
          // ✅ Si la sidebar est fermée, affichage d’un tooltip avec le nom
          <Tooltip title={!isSidebarOpen ? item.text : ""} placement="right" key={item.text}>
            <ListItem button onClick={() => navigate(item.path)} sx={{ px: 2 }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {/* Le texte ne s’affiche que si la sidebar est ouverte */}
              {isSidebarOpen && <ListItemText primary={item.text} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
};

// 📤 Export du composant pour qu’il soit utilisé ailleurs dans l'application
export default SidebarConnecte;

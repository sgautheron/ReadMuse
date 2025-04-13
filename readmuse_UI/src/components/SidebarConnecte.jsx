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

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookIcon from "@mui/icons-material/Book";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const SidebarConnecte = () => {
  const navigate = useNavigate();
  const { utilisateur } = useUser();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  if (!utilisateur) return null;

  const menuItems = [
    { text: "Mon Profil", icon: <PersonIcon />, path: "/profil" },
    { text: "Mon Cercle", icon: <FavoriteIcon />, path: "/mon-cercle" },
    { text: "Mes Recos", icon: <BookIcon />, path: "/recommandations" },
    { text: "Ma bibliothèque", icon: <HistoryEduIcon />, path: "/bibliotheque" },
  ];

  return (
    <Box
      sx={{
        width: isSidebarOpen ? 230 : 70,
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
      <IconButton onClick={toggleSidebar} sx={{ ml: 1, mt: 1 }}>
        {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>

      <List>
        {menuItems.map((item) => (
          <Tooltip title={!isSidebarOpen ? item.text : ""} placement="right" key={item.text}>
            <ListItem button onClick={() => navigate(item.path)} sx={{ px: 2 }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {isSidebarOpen && <ListItemText primary={item.text} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );
};

export default SidebarConnecte;

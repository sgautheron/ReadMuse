import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookIcon from "@mui/icons-material/Book";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const SidebarConnecte = () => {
  const navigate = useNavigate();
  const { utilisateur } = useUser();

  if (!utilisateur) return null;

  return (
    <Box
      sx={{
        width: 230,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#f5f0e6",
        boxShadow: "2px 0 6px rgba(0,0,0,0.05)",
        pt: 10,
        zIndex: 10,
      }}
    >
      <List>
        <ListItem button onClick={() => navigate("/profil")}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Mon Profil" />
        </ListItem>

        <ListItem button onClick={() => navigate("/mon-cercle")}>
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Mon Cercle" />
        </ListItem>

        <ListItem button onClick={() => navigate("/recommandations")}>
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary="Mes Recos" />
        </ListItem>

        <ListItem button onClick={() => navigate("/historique")}>
          <ListItemIcon>
            <HistoryEduIcon />
          </ListItemIcon>
          <ListItemText primary="Mon Historique" />
        </ListItem>

        <ListItem button onClick={() => navigate("/profil-emotionnel")}>
          <ListItemIcon>
            <EmojiEmotionsIcon />
          </ListItemIcon>
          <ListItemText primary="Profil émotionnel" />
        </ListItem>
      </List>
      <Divider />
    </Box>
  );
};

export default SidebarConnecte;

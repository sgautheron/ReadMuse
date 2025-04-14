// Hooks React pour les effets et l’état local
import { useEffect, useState } from "react";

// Composants UI de Material UI
import {
  Box,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

// Contexte utilisateur : permet d’accéder à l’utilisateur connecté
import { useUser } from "../context/UserContext";

// Pour faire des liens vers les profils utilisateurs
import { Link } from "react-router-dom";

const MonCercle = () => {
  // 👤 Récupération de l’utilisateur connecté via le contexte
  const { utilisateur } = useUser();

  // Stocke la liste des membres du cercle
  const [membres, setMembres] = useState([]);

  // Appel à l’API pour récupérer les membres du cercle dès que l’utilisateur est chargé
  useEffect(() => {
    if (utilisateur) {
      fetch(`http://127.0.0.1:8000/cercle/${utilisateur.ID_Utilisateur}`)
        .then((res) => res.json())
        .then((data) => setMembres(data)); // ✅ Stockage dans l’état local
    }
  }, [utilisateur]);

  return (
    <Box sx={{ px: 4, pt: 10 }}>
      {/* 🧾 Titre principal */}
      <Typography variant="h4" gutterBottom>
        Mon Cercle de Lecture
      </Typography>

      {/* Si on a des membres */}
      {membres.length > 0 ? (
        <List>
          {membres.map((membre) => (
            <Paper key={membre.id} sx={{ my: 1, p: 2 }}>
              <ListItem
                component={Link}
                to={`/utilisateur/${membre.id}`} // Redirige vers le profil du membre
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": { backgroundColor: "#f5f5f5" }, // Hover doux
                }}
              >
                {/* Avatar avec première lettre du nom */}
                <ListItemAvatar>
                  <Avatar>{membre.nom[0]}</Avatar>
                </ListItemAvatar>

                {/* Affiche le nom et l’email */}
                <ListItemText primary={membre.nom} secondary={membre.email} />
              </ListItem>
            </Paper>
          ))}
        </List>
      ) : (
        // Si aucun membre trouvé
        <Typography color="text.secondary">Tu n'as encore ajouté personne à ton Cercle</Typography>
      )}
    </Box>
  );
};

export default MonCercle;

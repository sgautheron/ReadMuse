import { useEffect, useState } from "react";
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
import { useUser } from "../context/UserContext";

const MonCercle = () => {
  const { utilisateur } = useUser();
  const [membres, setMembres] = useState([]);

  useEffect(() => {
    if (utilisateur) {
      fetch(`http://127.0.0.1:8000/cercle/${utilisateur.ID_Utilisateur}`)
        .then((res) => res.json())
        .then((data) => setMembres(data));
    }
  }, [utilisateur]);

  return (
    <Box sx={{ px: 4, pt: 10 }}>
      <Typography variant="h4" gutterBottom>
        🌸 Mon Cercle de Lecture
      </Typography>

      {membres.length > 0 ? (
        <List>
          {membres.map((membre) => (
            <Paper key={membre.id} sx={{ my: 1, p: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{membre.nom[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={membre.nom} secondary={membre.email} />
              </ListItem>
            </Paper>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary">
          Tu n'as encore ajouté personne à ton Cercle 🌱
        </Typography>
      )}
    </Box>
  );
};

export default MonCercle;

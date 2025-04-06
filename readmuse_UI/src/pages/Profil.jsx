import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Profil() {
  const { utilisateur, setUtilisateur } = useUser();
  const navigate = useNavigate();
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    if (!utilisateur) {
      navigate("/login");
      return;
    }

    const fetchInteractions = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/interactions/${utilisateur.ID_Utilisateur}`);
        if (!res.ok) {
          throw new Error("Erreur de récupération des interactions");
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Format inattendu des interactions");
        }
        setInteractions(data);
      } catch (err) {
        console.error("Erreur lors du chargement des interactions", err);
        setInteractions([]); // évite le .map sur undefined
      }
    };

    fetchInteractions();
  }, [utilisateur, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("utilisateur");
    setUtilisateur(null);
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, width: 600 }}>
        <Typography variant="h4" gutterBottom>
          Mon Profil
        </Typography>

        <Typography variant="subtitle1">👤 Nom : {utilisateur?.Nom}</Typography>
        <Typography variant="subtitle1">📧 Email : {utilisateur?.Email}</Typography>

        <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
          Se déconnecter
        </Button>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          🕒 Historique de mes lectures
        </Typography>

        {interactions.length === 0 ? (
          <Typography color="text.secondary">Aucune interaction enregistrée.</Typography>
        ) : (
          interactions.map((item) => (
            <Paper key={item.ID_Interaction} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{item.Titre}</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                📅 {new Date(item.Date).toLocaleDateString()}
              </Typography>
              <Typography>{item.Description}</Typography>
            </Paper>
          ))
        )}
      </Paper>
    </Box>
  );
}

export default Profil;

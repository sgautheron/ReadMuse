import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Autocomplete,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fetchLivres } from "../api/livres";

function Formulaire() {
  const theme = useTheme();
  const [livres, setLivres] = useState([]);
  const [auteurs, setAuteurs] = useState([]);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [style, setStyle] = useState("");
  const [intrigue, setIntrigue] = useState("");
  const [themeText, setThemeText] = useState("");
  const [message, setMessage] = useState(null);
  const [note, setNote] = useState("");


  useEffect(() => {
    const getLivres = async () => {
      const data = await fetchLivres();
      if (data && data.length > 0) {
        const livresTries = data.sort((a, b) => a.Titre.localeCompare(b.Titre));
        const auteursUniques = [...new Set(data.map((livre) => livre.Auteur))].sort();

        setLivres(livresTries);
        setAuteurs(auteursUniques);
      }
    };
    getLivres();
  }, []);

  const handleSubmit = async () => {
    if (!selectedLivre || !style.trim() || !intrigue.trim() || !themeText.trim()) {
      return;
    }

    const preferenceData = {
      ID_Utilisateur: 1, // Valeur fixe ou dynamique si tu ajoutes une authentification
      ID_Livre: selectedLivre.ID_Livre,
      Note: note ? parseInt(note) : null, // ✅ convertit en entier ou met null
      Style: style,
      Intrigue: intrigue,
      Theme: themeText,
    };
    console.log("👉 Données envoyées :", preferenceData);


    try {
      const response = await fetch("http://127.0.0.1:8000/interactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferenceData),
      });

      if (response.ok) {
        setMessage("Vos préférences ont bien été enregistrées !");
        setStyle("");
        setIntrigue("");
        setThemeText("");
      } else {
        setMessage("Une erreur s'est produite. Réessayez.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setMessage("Une erreur s'est produite.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "120vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        padding: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{ width: { xs: "90%", sm: "70%", md: "50%" }, padding: 4, borderRadius: 3 }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" textAlign="center">
          Partagez vos Préférences
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Décrivez un livre que vous avez aimé. Nous analyserons vos réponses pour vous recommander des lectures adaptées !
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={livres}
              getOptionLabel={(option) => option.Titre}
              renderInput={(params) => <TextField {...params} label="Titre du livre" variant="outlined" />}
              disabled={livres.length === 0}
              onChange={(event, newValue) => setSelectedLivre(newValue)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={auteurs}
              value={selectedLivre ? selectedLivre.Auteur : null}
              getOptionDisabled={() => !!selectedLivre}
              renderInput={(params) => <TextField {...params} label="Auteur" variant="outlined" />}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Que pouvez-vous dire du style d'écriture ?"
              variant="outlined"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Que pouvez-vous dire de l'intrigue ?"
              variant="outlined"
              value={intrigue}
              onChange={(e) => setIntrigue(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note sur 5"
                variant="outlined"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quel est le thème abordé dans ce livre ?"
              variant="outlined"
              value={themeText}
              onChange={(e) => setThemeText(e.target.value)}
            />
          </Grid>
          
        </Grid>

        {message && (
          <Box sx={{ mt: 2 }}>
            <Alert severity={message.includes("✅") ? "success" : "error"}>{message}</Alert>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedLivre || !style.trim() || !intrigue.trim() || !themeText.trim()}
          >
            Envoyer mes préférences
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Formulaire;

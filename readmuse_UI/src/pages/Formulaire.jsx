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
import { useNavigate } from "react-router-dom";

function Formulaire() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [livres, setLivres] = useState([]);
  const [auteurs, setAuteurs] = useState([]);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const getLivres = async () => {
      const data = await fetchLivres();
      if (data && data.length > 0) {
        // ➕ Élimine les doublons de titre (en gardant le premier pour chaque titre)
        const titresUniquesMap = new Map();
        data.forEach((livre) => {
          const titreCle = livre.Titre.toLowerCase().trim();
          if (!titresUniquesMap.has(titreCle)) {
            titresUniquesMap.set(titreCle, livre);
          }
        });

        const livresUniques = Array.from(titresUniquesMap.values()).sort((a, b) =>
          a.Titre.localeCompare(b.Titre)
        );

        const auteursUniques = [...new Set(data.map((livre) => livre.Auteur))].sort();

        setLivres(livresUniques);
        setAuteurs(auteursUniques);
      }
    };
    getLivres();
  }, []);

  const handleSubmit = async () => {
    if (!selectedLivre || !description.trim()) {
      return;
    }

    const preferenceData = {
      ID_Utilisateur: 1,
      ID_Livre: selectedLivre.ID_Livre,
      Note: note ? parseInt(note) : null,
      Description: description,
    };

    try {
      // Envoie des préférences
      const response = await fetch("http://127.0.0.1:8000/interactions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferenceData),
      });

      if (response.ok) {
        // Appel à l'API de recommandations
        const recoResponse = await fetch("http://127.0.0.1:8000/api/recommander", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texte: description }),
        });

        const recoData = await recoResponse.json();

        // Redirige vers /resultats avec les recommandations
        localStorage.setItem("recommandations", JSON.stringify(recoData.recommandations));
        navigate("/recommandations", { state: { description } });

        setDescription("");
        setMessage("Vos préférences ont bien été enregistrées !");
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
          Décrivez un livre que vous avez aimé. Nous analyserons vos réponses pour vous recommander
          des lectures adaptées !
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={livres}
              getOptionLabel={(option) => option.Titre}
              filterOptions={(options, state) =>
                options.filter((opt) =>
                  opt.Titre.toLowerCase().includes(state.inputValue.toLowerCase())
                )
              }
              renderInput={(params) => (
                <TextField {...params} label="Titre du livre" variant="outlined" />
              )}
              disabled={livres.length === 0}
              onChange={(event, newValue) => setSelectedLivre(newValue)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={auteurs}
              value={selectedLivre ? selectedLivre.Auteur : null}
              onChange={(event, newAuteur) => {
                if (!newAuteur) return;
                const livreAssocie = livres.find((livre) => livre.Auteur === newAuteur);
                setSelectedLivre(livreAssocie || null);
              }}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params} label="Auteur" variant="outlined" />}
              disabled={livres.length === 0}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pourquoi avez-vous aimé ce livre ?"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Parlez-nous de l'univers, du style, de l'intrigue, des émotions..."
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
            disabled={!selectedLivre || !description.trim()}
          >
            Envoyer mes préférences
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Formulaire;

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
import { fetchLivresParPopularite } from "../api/livres";
import { useNavigate } from "react-router-dom";

function Formulaire() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [livres, setLivres] = useState([]);
  const [auteurs, setAuteurs] = useState([]);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const getLivres = async () => {
      const data = await fetchLivresParPopularite();
      if (data && data.length > 0) {
        const titresUniquesMap = new Map();
        data.forEach((livre) => {
          const titreCle = livre.Titre.toLowerCase().trim();
          if (!titresUniquesMap.has(titreCle)) {
            titresUniquesMap.set(titreCle, livre);
          }
        });

        const livresUniques = Array.from(titresUniquesMap.values());

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
      Note: null,
      Description: description,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/interactions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferenceData),
      });

      if (response.ok) {
        const recoResponse = await fetch("http://127.0.0.1:8000/api/recommander", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texte: description }),
        });

        const recoData = await recoResponse.json();
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
        sx={{ width: { xs: "90%", sm: "70%", md: "60%" }, padding: 4, borderRadius: 3 }}
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

          {/* 🧠 Exemple */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={6}
              label="Pourquoi avez-vous aimé ce livre ?"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Parlez-nous de l'univers, du style, de l'intrigue, des émotions..."
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Exemple :</strong> J’ai adoré ce livre pour son univers riche et immersif. Les
              personnages sont bien développés, l’écriture est fluide et poétique, et j’ai été
              happée par le suspense jusqu’à la fin.
            </Typography>
            <Typography
              variant="body2"
              color="warning.main"
              sx={{ mb: 2, fontStyle: "italic", display: "flex", alignItems: "center", gap: 1 }}
            >
              ⚠️ Conseil : Essayez d’être précis. Évitez « Ce livre est super, j’ai adoré les
              personnages », et préférez des détails sur l’écriture, l’univers ou les émotions
              ressenties.
            </Typography>
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

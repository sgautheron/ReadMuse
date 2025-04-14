// Import React & hooks
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Composants MUI
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";

// Context & routing
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProfilPublic = () => {
  // ID de l'utilisateur dont on consulte le profil
  const { id } = useParams();
  const { utilisateur } = useUser(); // 👤 Utilisateur actuellement connecté
  const navigate = useNavigate();

  // États pour stocker les infos du profil public
  const [profil, setProfil] = useState(null); // mots-clés émotionnels
  const [nom, setNom] = useState(null);
  const [compatibilite, setCompatibilite] = useState(null); // score avec l'utilisateur actuel
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // feedback utilisateur

  // Couleurs pastel pour les mots-clés
  const pastelColors = [
    "#ffe5ec",
    "#e0f7fa",
    "#f3e5f5",
    "#fff3cd",
    "#d1f7c4",
    "#ffebcc",
    "#cdeffd",
  ];

  // Fonction pour attribuer une couleur à un mot
  const getColor = (str) => {
    const hash = [...str].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return pastelColors[hash % pastelColors.length];
  };

  // Chargement du profil public et calcul de compatibilité émotionnelle
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/utilisateurs/${id}/profil_emotionnel`);
        const data = await res.json();
        setProfil(data.mots_cles_emotionnels);
        setNom(data.nom);

        // Si on consulte un autre profil que le sien, calcul de compatibilité
        if (utilisateur?.ID_Utilisateur && utilisateur.ID_Utilisateur !== parseInt(id)) {
          const resCompat = await fetch(
            `http://127.0.0.1:8000/utilisateurs/${utilisateur.ID_Utilisateur}/compatibilite_emotionnelle/${id}`
          );
          const compatData = await resCompat.json();
          setCompatibilite({
            score: compatData.compatibilite_emotionnelle,
            mots: compatData.mots_commun,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
        setLoading(false);
      }
    };

    fetchProfil();
  }, [id, utilisateur]);

  // Ajout à son cercle
  const handleRejoindreCercle = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/cercle/${utilisateur.ID_Utilisateur}/ajouter/${id}`,
        { method: "POST" }
      );
      const data = await res.json();
      setMessage(data.message || "Ajout effectué !");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l’ajout au cercle.");
    }
  };

  // Loading
  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  // Aucun profil trouvé
  if (!profil) {
    return <Typography textAlign="center">Profil non disponible.</Typography>;
  }

  // Texte explicatif de compatibilité
  const getInterprétation = (score) => {
    if (score > 50) return "Vos sensibilités semblent vibrer en harmonie.";
    if (score > 20) return "Quelques affinités se dégagent de vos lectures.";
    return "Sensibilités différentes… mais parfois les opposés s’inspirent !";
  };

  return (
    <Box sx={{ padding: 4, maxWidth: "1200px", margin: "auto" }}>
      {/* Titre du profil */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Profil émotionnel de {nom}
      </Typography>

      {/* Compatibilité avec l'utilisateur connecté */}
      {compatibilite && (
        <Paper
          elevation={2}
          sx={{
            background: "linear-gradient(90deg, #fff0f5 0%, #f5f0ff 100%)",
            p: 3,
            mb: 3,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Compatibilité émotionnelle : <strong>{compatibilite.score}%</strong>
          </Typography>

          {/* Barre de progression */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={compatibilite.score}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#f3e5f5",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#f06292",
                },
              }}
            />
          </Box>

          <Typography variant="body2" sx={{ fontStyle: "italic", color: "gray" }}>
            {getInterprétation(compatibilite.score)}
          </Typography>

          {/* Mots communs affichés */}
          {compatibilite.mots?.length > 0 && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Vous avez été touché·es par des thèmes similaires :{" "}
              <strong>{compatibilite.mots.join(", ")}</strong>
            </Typography>
          )}
        </Paper>
      )}

      {/* Mots-clés émotionnels du profil consulté */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Mots-clés émotionnels les plus utilisés
      </Typography>
      <Paper sx={{ padding: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {profil.map((mot, index) => (
          <Chip
            key={index}
            label={mot}
            onClick={() => navigate(`/motcle/${encodeURIComponent(mot)}`)}
            clickable
            sx={{
              backgroundColor: getColor(mot),
              fontWeight: "bold",
              textTransform: "capitalize",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          />
        ))}
      </Paper>

      {/* Bouton d’ajout au Cercle */}
      {utilisateur?.ID_Utilisateur && utilisateur.ID_Utilisateur !== parseInt(id) && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<FavoriteIcon />}
            color="secondary"
            size="large"
            onClick={handleRejoindreCercle}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "999px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              textTransform: "none",
            }}
          >
            Rejoindre son Cercle
          </Button>
        </Box>
      )}

      {/* Snackbar feedback */}
      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setMessage(null)} severity="info" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilPublic;

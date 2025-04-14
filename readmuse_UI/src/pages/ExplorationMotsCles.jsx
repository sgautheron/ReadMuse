// Importation des hooks et composants nécessaires
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Composant principal d'exploration des mots-clés
function ExplorationMotsCles() {
  const navigate = useNavigate();

  // États pour gérer la recherche, les données et le chargement
  const [filtre, setFiltre] = useState("");
  const [motsCles, setMotsCles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tri, setTri] = useState("frequence");

  // Requête API pour récupérer les mots-clés populaires
  useEffect(() => {
    axios
      .get("http://localhost:8000/motcles_populaires")
      .then((res) => {
        setMotsCles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Erreur chargement mots-clés", err);
        setLoading(false);
      });
  }, []);

  // Lorsqu'on clique sur un mot-clé → redirection vers sa page dédiée
  const handleClick = (mot) => {
    navigate(`/motcle/${mot}`);
  };

  // Application des filtres + tri des mots-clés
  const motsFiltres = motsCles
    .filter((mot) => mot.nb_livres >= 3)
    .filter((mot) => mot.mot.toLowerCase().includes(filtre.toLowerCase()))
    .sort((a, b) => {
      if (tri === "alpha") return a.mot.localeCompare(b.mot);
      if (tri === "inverse") return a.nb_livres - b.nb_livres;
      return b.nb_livres - a.nb_livres; // par défaut : décroissant
    });

  // Fréquence maximale pour adapter la taille des chips
  const maxFreq = Math.max(...motsFiltres.map((m) => m.nb_livres), 1);

  // Rendu visuel
  return (
    <Box sx={{ mt: 5, pt: 12, px: 2, backgroundColor: "#f5f0e6", minHeight: "100vh" }}>
      {/* Titre principal */}
      <Typography variant="h1" gutterBottom>
        Exploration par mots-clés
      </Typography>

      {/* Champ de recherche */}
      <TextField
        label="Rechercher un mot-clé"
        variant="outlined"
        fullWidth
        sx={{ mb: 2, backgroundColor: "white" }}
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
      />

      {/* Menu déroulant de tri */}
      <Select
        value={tri}
        onChange={(e) => setTri(e.target.value)}
        size="small"
        sx={{ mb: 4, backgroundColor: "white" }}
      >
        <MenuItem value="frequence">Par fréquence</MenuItem>
        <MenuItem value="alpha">Ordre alphabétique</MenuItem>
        <MenuItem value="inverse">Par fréquence croissante</MenuItem>
      </Select>

      {/* Affichage du nombre total récupéré */}
      <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
        {motsCles.length} mots-clés récupérés
      </Typography>

      {/* Chargement ou affichage des chips */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 1,
            alignItems: "stretch",
          }}
        >
          {motsFiltres.map((motObj) => {
            // Calcul dynamique de la taille du mot-clé selon sa fréquence
            const minSize = 0.8;
            const maxSize = 3.5;
            const minFreq = 3;
            const ratio = (motObj.nb_livres - minFreq) / (maxFreq - minFreq || 1);
            const fontSizeRem = (minSize + (maxSize - minSize) * ratio).toFixed(2);

            return (
              <Box
                key={motObj.mot}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
              >
                {/* Chip interactif pour chaque mot-clé */}
                <Chip
                  label={`${motObj.mot} (${motObj.nb_livres})`}
                  onClick={() => handleClick(motObj.mot)}
                  sx={{
                    fontSize: `${fontSizeRem}rem`,
                    height: "auto",
                    padding: `${0.2 * fontSizeRem}rem ${0.6 * fontSizeRem}rem`,
                    borderRadius: "16px",
                    backgroundColor: "#e8e3dc",
                    cursor: "pointer",
                    textAlign: "center",
                    whiteSpace: "normal",
                    maxWidth: "100%",
                    "& .MuiChip-label": {
                      whiteSpace: "normal",
                      overflow: "visible",
                      textOverflow: "unset",
                    },
                    "&:hover": {
                      backgroundColor: "#5d4037",
                      color: "white",
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

// Export du composant pour utilisation dans l'app
export default ExplorationMotsCles;

import { useEffect, useState, useRef } from "react";
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
import WordCloudCompact from "../components/WordCloudCompact";

function ExplorationMotsCles() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState("");
  const [motsCles, setMotsCles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tri, setTri] = useState("frequence");

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

  const handleClick = (mot) => {
    navigate(`/motcle/${mot}`);
  };

  const motsFiltres = motsCles
    .filter((mot) => mot.nb_livres >= 3)
    .filter((mot) => mot.mot.toLowerCase().includes(filtre.toLowerCase()))
    .sort((a, b) => {
      if (tri === "alpha") return a.mot.localeCompare(b.mot);
      if (tri === "inverse") return a.nb_livres - b.nb_livres;
      return b.nb_livres - a.nb_livres;
    });

  const motsValides = motsFiltres
    .filter(
      (mot) =>
        mot.mot &&
        typeof mot.mot === "string" &&
        mot.mot.trim().length > 2 &&
        typeof mot.nb_livres === "number"
    )
    .map((mot, i) => {
      const cleanedText = mot.mot
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\d_]/g, "")
        .trim()
        .toLowerCase();

      return {
        text: cleanedText,
        value: mot.nb_livres,
        key: `${cleanedText}-${i}`,
      };
    })
    .filter((mot) => mot.text.length > 2)
    .slice(0, 50);

  return (
    <Box sx={{ mt: 3, pt: 12, px: 2, backgroundColor: "#f5f0e6", minHeight: "100vh" }}>
      <Typography variant="h1" gutterBottom>
        Exploration par mots-clés
      </Typography>

      <TextField
        label="Rechercher un mot-clé"
        variant="outlined"
        fullWidth
        sx={{ mb: 2, backgroundColor: "white" }}
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
      />

      <Select
        value={tri}
        onChange={(e) => setTri(e.target.value)}
        size="small"
        sx={{ mb: 4, backgroundColor: "white" }}
      >
        <MenuItem value="frequence">🔝 Par fréquence</MenuItem>
        <MenuItem value="alpha">🔤 Ordre alphabétique</MenuItem>
        <MenuItem value="inverse">🆕 Par fréquence croissante</MenuItem>
      </Select>

      <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
        {motsCles.length} mots-clés récupérés depuis le backend
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <WordCloudCompact words={motsValides} />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {motsFiltres.map((motObj) => (
              <Chip
                key={motObj.mot}
                label={`${motObj.mot} (${motObj.nb_livres})`}
                onClick={() => handleClick(motObj.mot)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.9rem",
                  "&:hover": {
                    backgroundColor: "#5d4037",
                    color: "white",
                    transform: "scale(1.05)",
                  },
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

export default ExplorationMotsCles;

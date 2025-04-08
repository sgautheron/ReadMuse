import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import themes from "../data/themes";

function ExplorationMotsCles() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [location]);

  const categories = Object.keys(themes);

  const handleMotCleClick = (mot) => {
    navigate(`/motcle/${mot}`);
  };

  // Couleurs pastel douces
  const pastelColors = [
    "#fce4ec",
    "#e1f5fe",
    "#f3e5f5",
    "#fff3e0",
    "#e8f5e9",
    "#ede7f6",
    "#f9fbe7",
    "#e0f2f1",
    "#fbe9e7",
    "#f1f8e9",
  ];

  return (
    <Box
      sx={{
        mt: 3,
        pt: 12,
        px: 4,
        backgroundColor: "#f5f0e6",
        minHeight: "100vh",
      }}
      ref={containerRef}
    >
      <Typography variant="h1" gutterBottom>
        Exploration par mots-clés
      </Typography>

      {/* Table des matières */}
      <Box sx={{ mt: 3, flexWrap: "wrap", gap: 1, mb: 4 }}>
        <Typography variant="h5" sx={{ display: "block", mb: 1 }}>
          Catégories
        </Typography>
        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {categories.map((cat) => (
            <Button key={cat} size="small" href={`#${cat}`} sx={{ textTransform: "none" }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Recherche */}
      <TextField
        label="Rechercher un mot-clé"
        variant="outlined"
        fullWidth
        sx={{ mb: 4, backgroundColor: "white" }}
        value={filtre}
        onChange={(e) => setFiltre(e.target.value.toLowerCase())}
      />

      {/* Blocs thématiques */}
      {categories.map((categorie, index) => {
        const mots = themes[categorie].filter((mot) => mot.toLowerCase().includes(filtre));
        if (mots.length === 0) return null;

        const bgColor = pastelColors[index % pastelColors.length];

        return (
          <Box key={categorie} id={categorie} sx={{ mt: 10, mb: 6, px: 2 }}>
            <Accordion defaultExpanded sx={{ backgroundColor: bgColor, p: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  {categorie.charAt(0).toUpperCase() + categorie.slice(1)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {mots.map((mot) => (
                    <Chip
                      key={mot}
                      label={mot}
                      variant="outlined"
                      onClick={() => handleMotCleClick(mot)}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: "#5d4037",
                          color: "white",
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        );
      })}
    </Box>
  );
}

export default ExplorationMotsCles;

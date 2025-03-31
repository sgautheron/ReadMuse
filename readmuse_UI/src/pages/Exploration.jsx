import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardMedia, CardContent, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const Exploration = () => {
  const [livresParCategorie, setLivresParCategorie] = useState({});
  const theme = useTheme();

  useEffect(() => {
    const fetchLivres = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/livres/par_categorie");
        setLivresParCategorie(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      }
    };
    fetchLivres();
  }, []);

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f0e6", minHeight: "100vh" }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4}>
        Explorer les Livres 📚
      </Typography>

      {Object.entries(livresParCategorie).map(([categorie, livres]) => (
        <Box key={categorie} sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {categorie}
          </Typography>

          {/* 🎬 Scroll horizontal */}
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              paddingBottom: 1,
              scrollSnapType: "x mandatory",
              "&::-webkit-scrollbar": { height: 6 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bbb",
                borderRadius: 10,
              },
            }}
          >
            {livres.map((livre) => (
              <Card
                key={livre.ID_Livre}
                sx={{
                  minWidth: 140,
                  maxWidth: 140,
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Link to={`/livre/${livre.ID_Livre}`}>
                  <CardMedia
                    component="img"
                    height="210"
                    image={livre.URL_Couverture}
                    alt={livre.Titre}
                  />
                </Link>
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {livre.Titre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {livre.Auteur}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Exploration;

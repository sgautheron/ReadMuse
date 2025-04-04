import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

const LivresParMotCle = () => {
  const { tag } = useParams();
  const [livres, setLivres] = useState([]);

  useEffect(() => {
    const fetchLivres = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/livres/motcle/${tag}`);
        setLivres(res.data);
      } catch (err) {
        console.error("❌ Erreur :", err);
      }
    };
    fetchLivres();
  }, [tag]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Livres associés au mot-clé : « {tag} »
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {livres.map((livre) => (
          <Card key={livre.ID_Livre} sx={{ width: 160 }}>
            <Link to={`/livre/${livre.ID_Livre}`}>
              <CardMedia
                component="img"
                height="210"
                image={livre.URL_Couverture}
                alt={livre.Titre}
              />
            </Link>
            <CardContent>
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
  );
};

export default LivresParMotCle;

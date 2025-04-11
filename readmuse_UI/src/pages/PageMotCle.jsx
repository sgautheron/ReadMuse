// 🔁 Page PageMotCle.jsx (inchangée à part le décodage + titre)
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, CardMedia, CardContent, Button } from "@mui/material";

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

const PageMotCle = () => {
  const { tag } = useParams();
  const motCle = decodeURIComponent(tag);
  const [livres, setLivres] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/livres/motcle/${motCle}`)
      .then((res) => {
        setLivres(res.data);
        setErreur(null);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setLivres([]);
          setErreur(null);
        } else {
          console.error("Erreur récupération livres :", err);
          setErreur("Une erreur est survenue lors du chargement.");
        }
      });
  }, [motCle]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Livres associés au mot-clé : {motCle}
      </Typography>

      {erreur ? (
        <Typography color="error">{erreur}</Typography>
      ) : livres.length === 0 ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Aucun livre n’a encore été associé au mot-clé <strong>« {motCle} »</strong>.
          </Typography>
          <Button variant="contained" component={Link} to="/formulaire">
            Proposez-en un via le formulaire ✍️
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {livres.map((livre, index) => (
            <Card
              key={livre.ID_Livre}
              sx={{
                width: 160,
                boxShadow: 2,
                borderRadius: 2,
                backgroundColor: pastelColors[index % pastelColors.length],
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Link
                to={`/livre/${livre.ID_Livre}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <CardMedia
                  component="img"
                  height="210"
                  image={livre.URL_Couverture}
                  alt={livre.Titre}
                />
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {livre.Titre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {livre.Auteur}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PageMotCle;

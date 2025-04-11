import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";

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

const normaliserMotCle = (mot) =>
  mot
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\d_]/g, "")
    .trim()
    .toLowerCase();

const PageMotCle = () => {
  const { tag } = useParams();
  const motCle = decodeURIComponent(tag);
  const motCleNormalise = normaliserMotCle(motCle);

  const [livres, setLivres] = useState([]);
  const [nbLivres, setNbLivres] = useState(0);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(true); // ✅

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/livres/motcle/${motCleNormalise}`)
      .then((res) => {
        setLivres(res.data.livres || []);
        setNbLivres(res.data.nb_livres || 0);
        setErreur(null);
      })
      .catch((err) => {
        console.error("Erreur récupération livres :", err);
        setErreur("Une erreur est survenue lors du chargement.");
        setLivres([]);
      })
      .finally(() => setLoading(false)); // ✅
  }, [motCleNormalise]);

  return (
    <Box sx={{ padding: 4 }}>
      {/* 🧠 Titre en bloc au-dessus */}
      <Box sx={{ width: "100%", mb: 3, mt: 15 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Quand les lecteurs parlent de <em>« {motCle} »</em>
        </Typography>
      </Box>

      {erreur ? (
        <Typography color="error">{erreur}</Typography>
      ) : loading ? (
        <Typography textAlign="center" sx={{ mt: 4 }}>
          ⏳ On fouille les avis à la recherche de ce mot...
        </Typography>
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
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
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

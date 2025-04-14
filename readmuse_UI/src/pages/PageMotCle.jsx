// Hooks React
import React, { useEffect, useState } from "react";

// Pour récupérer le paramètre dans l’URL (ex: /motcle/amour)
import { useParams, Link } from "react-router-dom";

// Pour appeler l’API backend
import axios from "axios";

// Composants Material UI
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";

// Couleurs de fond pour chaque carte (pastel, harmonieux)
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

// Fonction pour normaliser un mot-clé (accents, majuscules, caractères spéciaux, etc.)
const normaliserMotCle = (mot) =>
  mot
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
    .replace(/[^\w\s-]/g, "") // Supprime ponctuation
    .replace(/[\d_]/g, "") // Supprime chiffres et underscores
    .trim()
    .toLowerCase(); // Met en minuscules

const PageMotCle = () => {
  // Récupère le tag depuis l’URL
  const { tag } = useParams();
  const motCle = decodeURIComponent(tag);
  const motCleNormalise = normaliserMotCle(motCle); // 🔧 Nettoyage

  // États de l’application
  const [livres, setLivres] = useState([]);
  const [nbLivres, setNbLivres] = useState(0);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(true);

  // Appel à l’API à chaque fois que le mot-clé change
  useEffect(() => {
    setLoading(true); // Début chargement
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
      .finally(() => setLoading(false)); // Fin du chargement
  }, [motCleNormalise]);

  return (
    <Box sx={{ padding: 4 }}>
      {/* Titre principal */}
      <Box sx={{ width: "100%", mb: 3, mt: 5 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Quand les lecteurs parlent de <em>« {motCle} »</em>
        </Typography>
      </Box>

      {/* Gestion des erreurs ou des états de chargement */}
      {erreur ? (
        <Typography color="error">{erreur}</Typography>
      ) : loading ? (
        <Typography textAlign="center" sx={{ mt: 4 }}>
          On fouille les avis à la recherche de ce mot...
        </Typography>
      ) : livres.length === 0 ? (
        // Aucun livre associé
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Aucun livre n’a encore été associé au mot-clé <strong>« {motCle} »</strong>.
          </Typography>
          <Button variant="contained" component={Link} to="/formulaire">
            Proposez-en un via le formulaire
          </Button>
        </Box>
      ) : (
        // Affichage des livres associés
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
          {livres.map((livre, index) => (
            <Card
              key={livre.ID_Livre}
              sx={{
                width: 160,
                boxShadow: 2,
                borderRadius: 2,
                backgroundColor: pastelColors[index % pastelColors.length], // Couleur pastel dynamique
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)", // Zoom au survol
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

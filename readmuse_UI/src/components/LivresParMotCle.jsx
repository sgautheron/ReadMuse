// Imports React & Librairies
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

// Composant principal : affiche les livres associés à un mot-clé passé dans l'URL
const LivresParMotCle = () => {
  // Récupère le mot-clé depuis l’URL (ex: /livres/motcle/amour → tag = "amour")
  const { tag } = useParams();

  // État local pour stocker la liste des livres récupérés
  const [livres, setLivres] = useState([]);

  // useEffect : déclenché à chaque changement de `tag`
  useEffect(() => {
    // Appel API pour récupérer les livres associés à ce mot-clé
    const fetchLivres = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/livres/motcle/${tag}`);
        setLivres(res.data); // Met à jour l’état avec la réponse
      } catch (err) {
        console.error("❌ Erreur :", err);
      }
    };

    fetchLivres(); // Exécute la fonction au montage ou lors d’un changement de tag
  }, [tag]);

  // Affichage du composant
  return (
    <Box sx={{ p: 4 }}>
      {/* Titre dynamique selon le mot-clé */}
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Livres associés au mot-clé : « {tag} »
      </Typography>

      {/* Grille responsive contenant les cartes de livres */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {livres.map((livre) => (
          <Card key={livre.ID_Livre} sx={{ width: 160 }}>
            {/* Lien vers la page détail du livre */}
            <Link to={`/livre/${livre.ID_Livre}`}>
              <CardMedia
                component="img"
                height="210"
                image={livre.URL_Couverture}
                alt={livre.Titre}
              />
            </Link>
            <CardContent>
              {/* Titre du livre */}
              <Typography variant="body2" fontWeight="bold" noWrap>
                {livre.Titre}
              </Typography>

              {/* Auteur du livre */}
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

// Export du composant pour l’utiliser ailleurs dans l’app
export default LivresParMotCle;

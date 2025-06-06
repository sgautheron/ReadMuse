// Hooks React
import { useEffect, useState } from "react";

// Composants Material UI
import { Box, Typography, Paper, Button, Divider } from "@mui/material";

// Navigation et gestion de lien
import { useNavigate, Link } from "react-router-dom";

// Contexte utilisateur global
import { useUser } from "../context/UserContext";

function Profil() {
  const { utilisateur, setUtilisateur } = useUser(); // 👤 Données utilisateur globales
  const navigate = useNavigate();

  // États pour les données utilisateur
  const [interactions, setInteractions] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [stats, setStats] = useState(null);
  const [profilIA, setProfilIA] = useState(null); // 🧠 Profil généré automatiquement

  // Chargement des données dès que l’utilisateur est connecté
  useEffect(() => {
    if (!utilisateur) {
      navigate("/login"); // Redirige si non connecté
      return;
    }

    const fetchData = async () => {
      try {
        // Appels multiples en parallèle
        const [resFavoris, resInteractions, resStats, resProfilIA] = await Promise.all([
          fetch(`http://127.0.0.1:8000/favoris/${utilisateur.ID_Utilisateur}`),
          fetch(`http://127.0.0.1:8000/interactions/${utilisateur.ID_Utilisateur}`),
          fetch(`http://127.0.0.1:8000/utilisateurs/${utilisateur.ID_Utilisateur}/stats`),
          fetch(`http://127.0.0.1:8000/utilisateurs/${utilisateur.ID_Utilisateur}/profil_ia`),
        ]);

        // Transformation des données
        const favorisData = await resFavoris.json();
        const interactionsData = await resInteractions.json();
        const statsData = await resStats.json();
        const profilIAData = await resProfilIA.json();

        // Mise à jour des états
        setFavoris(favorisData);
        setInteractions(Array.isArray(interactionsData) ? interactionsData : []);
        setStats(statsData);
        setProfilIA(profilIAData.profil); // Extraction du champ "profil"
      } catch (err) {
        console.error("Erreur lors du chargement des données", err);
      }
    };

    fetchData();
  }, [utilisateur, navigate]);

  // Déconnexion simple
  const handleLogout = () => {
    localStorage.removeItem("utilisateur");
    setUtilisateur(null);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        mt: 15,
        mx: 4,
        flexWrap: "wrap",
      }}
    >
      {/* Carte profil utilisateur */}
      <Paper elevation={4} sx={{ p: 4, width: 500, borderRadius: 4, height: "fit-content" }}>
        <Typography variant="h4" gutterBottom>
          Mon Profil
        </Typography>
        <Typography variant="subtitle1">Nom : {utilisateur?.Nom}</Typography>
        <Typography variant="subtitle1">Email : {utilisateur?.Email}</Typography>

        <Button color="error" onClick={handleLogout} sx={{ mt: 2 }}>
          Se déconnecter
        </Button>
      </Paper>

      {/* Partie droite : favoris, stats, IA */}
      <Box sx={{ width: 600 }}>
        {/* Favoris */}
        <Typography variant="h4" gutterBottom>
          Mes livres favoris
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {favoris.length === 0 ? (
            <Typography color="text.secondary">Aucun livre marqué en favori.</Typography>
          ) : (
            favoris.map((livre) => (
              <Paper
                key={livre.ID_Livre}
                sx={{
                  width: 180,
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: "#f7f3e9",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {livre.URL_Couverture && (
                  <img
                    src={livre.URL_Couverture}
                    alt={livre.Titre}
                    style={{ width: 80, borderRadius: 6, marginBottom: 8 }}
                  />
                )}
                <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
                  {livre.Titre}
                </Typography>
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  {livre.Auteur}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  component={Link}
                  to={`/livre/${livre.ID_Livre}`}
                  sx={{ mt: 1, borderRadius: 2 }}
                >
                  Voir le livre
                </Button>
              </Paper>
            ))
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Statistiques utilisateur */}
        <Typography variant="h4" gutterBottom>
          Statistiques de lecture
        </Typography>
        {stats ? (
          <Box sx={{ mb: 3 }}>
            <Typography>Livres lus : {stats.livres_distincts}</Typography>
            <Typography>Total d’interactions : {stats.total_interactions}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">Chargement des statistiques...</Typography>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Profil IA */}
        <Typography variant="h4" gutterBottom>
          Mon profil littéraire généré par l’IA
        </Typography>
        {profilIA ? (
          <Paper sx={{ p: 2, backgroundColor: "#f5f0e6", borderRadius: 3 }}>
            <Typography>{profilIA}</Typography>
          </Paper>
        ) : (
          <Typography color="text.secondary">Le profil n’a pas encore été généré.</Typography>
        )}
      </Box>
    </Box>
  );
}

export default Profil;

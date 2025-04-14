// Importation des hooks React et composants MUI
import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // 🔐 Contexte utilisateur (auth)
import backgroundImage from "../assets/bibliotheque.jpg"; // 🖼️ Image de fond
import theme from "../theme/theme"; // 🎨 Thème MUI personnalisé

function Login() {
  // États locaux pour les champs de saisie
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null); // Pour afficher une erreur éventuelle

  const navigate = useNavigate();
  const { utilisateur, setUtilisateur } = useUser(); // Accès au contexte utilisateur

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (utilisateur) {
      navigate("/profil"); // Redirige vers le profil
    }
  }, [utilisateur, navigate]);

  // Fonction pour envoyer les infos de connexion
  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/utilisateurs/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Mot_De_Passe: motDePasse }), // 🧾 Données envoyées
      });

      if (!res.ok) {
        setErreur("Email ou mot de passe incorrect."); // ❌ Authentification échouée
        return;
      }

      const data = await res.json();
      localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur)); // Sauvegarde dans localStorage
      setUtilisateur(data.utilisateur); // Mise à jour du contexte
      navigate("/profil"); // Redirection vers le profil
    } catch (err) {
      console.error(err);
      setErreur("Erreur lors de la connexion."); // Erreur réseau ou serveur
    }
  };

  // Rendu du formulaire de connexion
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Titre de la page */}
        <Typography variant="h3" mb={2} textAlign="center">
          Connexion
        </Typography>

        {/* Champ email */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Champ mot de passe */}
        <TextField
          label="Mot de passe"
          variant="outlined"
          fullWidth
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        {/* Affichage du message d'erreur */}
        {erreur && (
          <Typography color="error" mt={1}>
            {erreur}
          </Typography>
        )}

        {/* Bouton de connexion */}
        <Button fullWidth sx={{ mt: 3 }} onClick={handleLogin}>
          Se connecter
        </Button>

        {/* Lien vers l'inscription */}
        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
          Pas encore de compte ?{" "}
          <Button onClick={() => navigate("/register")} sx={{ ml: 1 }} size="small">
            S’inscrire
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;

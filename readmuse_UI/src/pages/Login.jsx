// pages/Login.jsx
import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();
  const { utilisateur, setUtilisateur } = useUser();

  if (utilisateur) {
    navigate("/profil"); // ou / si tu préfères
  }

  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/utilisateurs/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Mot_De_Passe: motDePasse }),
      });

      if (!res.ok) {
        setErreur("Email ou mot de passe incorrect.");
        return;
      }

      const data = await res.json();

      // 💾 Stocke l’utilisateur en localStorage
      localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
      setUtilisateur(data.utilisateur); // ← ici !
      navigate("/profil"); // ou accueil si tu préfères
    } catch (err) {
      setErreur("Erreur lors de la connexion.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Connexion
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mot de passe"
          variant="outlined"
          fullWidth
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />
        {erreur && (
          <Typography color="error" mt={1}>
            {erreur}
          </Typography>
        )}
        <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleLogin}>
          Se connecter
        </Button>
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          Pas encore de compte ?{" "}
          <Button variant="text" onClick={() => navigate("/register")}>
            S’inscrire
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;

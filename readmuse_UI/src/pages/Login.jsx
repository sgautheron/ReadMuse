import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import backgroundImage from "../assets/bibliotheque.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();
  const { utilisateur, setUtilisateur } = useUser();

  if (utilisateur) {
    navigate("/profil");
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
      localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
      setUtilisateur(data.utilisateur);
      navigate("/profil");
    } catch (err) {
      setErreur("Erreur lors de la connexion.");
    }
  };

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
        }}
      >
        <Typography variant="h3" mb={2} textAlign="center">
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
        <Button fullWidth sx={{ mt: 3 }} onClick={handleLogin}>
          Se connecter
        </Button>
        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
          Pas encore de compte ?
          <Button onClick={() => navigate("/register")} sx={{ ml: 3 }}>
            S’inscrire
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;

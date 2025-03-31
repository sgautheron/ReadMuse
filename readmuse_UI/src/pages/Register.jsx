// pages/Register.jsx
import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/utilisateurs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Nom: nom, Email: email, Mot_De_Passe: motDePasse }),
      });

      if (!res.ok) {
        const error = await res.text();
        setErreur(error);
        return;
      }

      const data = await res.json();
      // Tu peux directement connecter l'utilisateur après inscription
      localStorage.setItem("utilisateur", JSON.stringify(data.utilisateur));
      navigate("/login"); // Ou /profil si tu veux connecter direct
    } catch (err) {
      setErreur("Erreur lors de l'inscription.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Inscription
        </Typography>
        <TextField
          label="Nom"
          variant="outlined"
          fullWidth
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          sx={{ mb: 2 }}
        />
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
        <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleRegister}>
          S’inscrire
        </Button>
      </Paper>
    </Box>
  );
}

export default Register;

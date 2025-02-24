import { Box, TextField, Typography, Button, Grid, Paper, Divider, Autocomplete } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Exemple de données triées par ordre alphabétique
const livres = [
  { title: "1984", author: "George Orwell" },
  { title: "Harry Potter à l'école des sorciers", author: "J.K. Rowling" },
  { title: "L'Étranger", author: "Albert Camus" },
  { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry" },
  { title: "Les Misérables", author: "Victor Hugo" },
].sort((a, b) => a.title.localeCompare(b.title));

const auteurs = [
  "Albert Camus",
  "Antoine de Saint-Exupéry",
  "George Orwell",
  "J.K. Rowling",
  "Victor Hugo",
].sort((a, b) => a.localeCompare(b));

function Formulaire() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "120vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        padding: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: "90%", sm: "70%", md: "50%" },
          padding: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        {/* En-tête */}
        <Typography variant="h4" fontWeight="bold" color="primary" textAlign="center">
          Partagez vos Préférences
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Décrivez un livre que vous avez aimé et pourquoi vous l'avez apprécié. Notre algorithme analysera votre réponse pour comprendre vos préférences littéraires et vous proposer des recommandations personnalisées qui pourraient devenir vos prochains coups de cœur !
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Champs du formulaire */}
        <Grid container spacing={2}>
          {/* Sélection du titre */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={livres}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => <TextField {...params} label="Titre du livre" variant="outlined" />}
            />
          </Grid>

          {/* Sélection de l'auteur */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={auteurs}
              renderInput={(params) => <TextField {...params} label="Auteur" variant="outlined" />}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pourquoi aimez-vous ce livre ?"
              variant="outlined"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Que pouvez-vous dire du style d'écriture ?"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Que pouvez-vous dire de l'intrigue ?"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Que pouvez-vous dire du thème ?"
              variant="outlined"
            />
          </Grid>
        </Grid>

        {/* Bouton d'envoi */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              padding: "12px 24px",
              fontSize: "1rem",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
              },
            }}
          >
            Envoyer mes préférences
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Formulaire;

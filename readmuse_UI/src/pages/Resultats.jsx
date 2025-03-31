import { useLocation } from "react-router-dom";
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip } from "@mui/material";

export default function Resultats() {
  const location = useLocation();
  const recommandations = location.state?.recommandations || [];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vos recommandations
      </Typography>

      {recommandations.length === 0 ? (
        <Typography color="text.secondary">
          Aucune recommandation pour le moment. Essayez avec une autre description.
        </Typography>
      ) : (
        <List>
          {recommandations.map((livre) => (
            <Paper key={livre.id} elevation={3} sx={{ mb: 2, p: 2 }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={livre.titre}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Score de correspondance : {livre.score}
                      </Typography>
                      <Box mt={1}>
                        {livre.themes_partagés.map((theme, i) => (
                          <Chip key={i} label={theme} sx={{ mr: 1, mb: 1 }} />
                        ))}
                      </Box>
                    </>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
}

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

function InfoModal({ open, handleClose }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>✨ Bienvenue sur ReadMuse !</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          ReadMuse vous aide à découvrir des livres adaptés à vos goûts. Décrivez un livre que vous
          avez aimé, et nous vous proposerons des recommandations personnalisées.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Plus vous partagez vos préférences, plus nos suggestions s'affineront pour vous offrir des
          lectures inoubliables. 📖
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#FF9C54" }}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InfoModal;

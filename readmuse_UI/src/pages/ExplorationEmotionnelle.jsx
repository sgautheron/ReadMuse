import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";

function ExplorationEmotionnelle() {
  const [categories, setCategories] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/exploration_emo").then((res) => {
      setCategories(res.data);
    });
    axios.get("http://localhost:8000/livres/").then((res) => {
      setAllBooks(res.data);
    });
  }, []);

  const filteredBooks = allBooks.filter((livre) =>
    livre.Titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showSearchResults = searchQuery.trim().length > 0;

  return (
    <Box sx={{ px: 3, pt: 12, backgroundColor: "#f5f0e6", minHeight: "100vh" }}>
      <Typography variant="h1" gutterBottom>
        Explorer les livres par émotions 💬
      </Typography>

      <TextField
        label="Rechercher un livre dans toute la base"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ my: 3 }}
      />

      {showSearchResults && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Résultats pour : <em>{searchQuery}</em>
          </Typography>
          <ScrollContainer className="scroll-container" horizontal>
            <Box sx={{ display: "flex", gap: 2 }}>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((livre) => (
                  <Box
                    key={livre.ID_Livre}
                    sx={{
                      width: 150,
                      flexShrink: 0,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                    onClick={() => navigate(`/livre/${livre.ID_Livre}`)}
                  >
                    <img
                      src={livre.URL_Couverture}
                      alt={livre.Titre}
                      style={{
                        width: "100%",
                        borderRadius: 8,
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Typography variant="subtitle2" noWrap>
                      {livre.Titre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {livre.Auteur}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>Aucun résultat trouvé.</Typography>
              )}
            </Box>
          </ScrollContainer>
        </Box>
      )}

      {!showSearchResults &&
        categories.map((cat) => (
          <Box key={cat.categorie} sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {cat.categorie}{" "}
              <Typography component="span" variant="body1">
                ({cat.nb_livres})
              </Typography>
            </Typography>
            <ScrollContainer className="scroll-container" horizontal>
              <Box sx={{ display: "flex", gap: 2 }}>
                {cat.livres.map((livre) => (
                  <Box
                    key={livre.ID_Livre}
                    sx={{
                      width: 150,
                      flexShrink: 0,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                    onClick={() => navigate(`/livre/${livre.ID_Livre}`)}
                  >
                    <img
                      src={livre.URL_Couverture}
                      alt={livre.Titre}
                      style={{
                        width: "100%",
                        borderRadius: 8,
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Typography variant="subtitle2" noWrap>
                      {livre.Titre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {livre.Auteur}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </ScrollContainer>
          </Box>
        ))}
    </Box>
  );
}

export default ExplorationEmotionnelle;

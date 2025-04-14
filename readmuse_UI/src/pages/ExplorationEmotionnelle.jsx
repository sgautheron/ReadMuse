import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";
import MenuBookIcon from "@mui/icons-material/MenuBook";

function ExplorationEmotionnelle() {
  const [categories, setCategories] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [topVentes, setTopVentes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/exploration_emo").then((res) => {
      setCategories(res.data);
    });

    axios.get("http://localhost:8000/livres/").then((res) => {
      setAllBooks(res.data);
    });

    axios.get("http://localhost:8000/livres/top-ventes").then((res) => {
      setTopVentes(res.data);
    });
  }, []);

  const filteredBooks = allBooks.filter((livre) =>
    livre.Titre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showSearchResults = searchQuery.trim().length > 0;

  const renderBookImage = (livre) => {
    const hasCover = livre.URL_Couverture && livre.URL_Couverture !== "";
    return hasCover ? (
      <img
        src={livre.URL_Couverture}
        alt={livre.Titre}
        style={{
          width: "100%",
          height: 200,
          objectFit: "cover",
          borderRadius: 8,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          textAlign: "left",
        }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.style.display = "none";
        }}
      />
    ) : (
      <Box
        sx={{
          width: "100%",
          height: 200,
          borderRadius: 2,
          backgroundColor: "#f5f0e6", // ✅ couleur de fond assortie
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <MenuBookIcon sx={{ fontSize: 60, color: "#aaa" }} />
      </Box>
    );
  };

  return (
    <Box sx={{ px: 3, pt: 12, backgroundColor: "#f5f0e6", minHeight: "100vh" }}>
      <Typography variant="h1" gutterBottom>
        Explorer les livres par émotions
      </Typography>

      <TextField
        label="Rechercher un livre"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ my: 3 }}
      />

      {/* Section Top Ventes */}
      {!showSearchResults && topVentes.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Top ventes de la semaine
          </Typography>
          <ScrollContainer className="scroll-container" horizontal>
            <Box sx={{ display: "flex", gap: 2 }}>
              {topVentes.map((livre) => (
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
                  {renderBookImage(livre)}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: 14,
                      textAlign: "left",
                    }}
                  >
                    {livre.Titre}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: 12,
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "left",
                    }}
                  >
                    {livre.Auteur}
                  </Typography>
                </Box>
              ))}
            </Box>
          </ScrollContainer>
        </Box>
      )}

      {/* Résultats de recherche */}
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
                    {renderBookImage(livre)}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 14,
                        textAlign: "left",
                      }}
                    >
                      {livre.Titre}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: 12,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "left",
                      }}
                    >
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

      {/* Exploration émotionnelle */}
      {!showSearchResults &&
        categories.map((cat) => (
          <Box key={cat.categorie} sx={{ mb: 6 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              {cat.categorie}{" "}
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
                    {renderBookImage(livre)}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 14,
                        textAlign: "left",
                      }}
                    >
                      {livre.Titre}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: 12,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "left",
                      }}
                    >
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

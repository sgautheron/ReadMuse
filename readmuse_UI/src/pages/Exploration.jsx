// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Card,
//   CardMedia,
//   CardContent,
//   useTheme,
//   Paper,
//   Autocomplete,
//   TextField,
// } from "@mui/material";
// import { Link } from "react-router-dom";

// const Exploration = () => {
//   const [livresParCategorie, setLivresParCategorie] = useState({});
//   const [livresTous, setLivresTous] = useState([]);
//   const [categoriesDisponibles, setCategoriesDisponibles] = useState([]);

//   const [filtreCategorie, setFiltreCategorie] = useState(null);
//   const [filtreTitre, setFiltreTitre] = useState(null);

//   const theme = useTheme();

//   useEffect(() => {
//     const fetchLivres = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/livres/par_categorie");
//         setLivresParCategorie(res.data);
//       } catch (err) {
//         console.error("Erreur lors du chargement :", err);
//       }
//     };
//     fetchLivres();
//   }, []);

//   useEffect(() => {
//     const livres = Object.entries(livresParCategorie).flatMap(([categorie, livres]) =>
//       livres.map((livre) => ({ ...livre, Categorie: categorie }))
//     );
//     setLivresTous(livres);
//     setCategoriesDisponibles(Object.keys(livresParCategorie));
//   }, [livresParCategorie]);

//   const livresFiltres = livresTous.filter((livre) => {
//     const matchCategorie = !filtreCategorie || livre.Categorie === filtreCategorie;
//     const matchTitre =
//       !filtreTitre || livre.Titre.toLowerCase().includes(filtreTitre.toLowerCase());
//     return matchCategorie && matchTitre;
//   });

//   return (
//     <Box
//       sx={{
//         paddingX: 4,
//         paddingTop: "96px",
//         paddingBottom: 4,
//         backgroundColor: "#f5f0e6",
//         minHeight: "100vh",
//         position: "relative",
//         zIndex: 0,
//       }}
//     >
//       <Box
//         sx={{
//           position: "sticky",
//           top: 64,
//           backgroundColor: "#f5f0e6",
//           zIndex: 2000,
//           paddingBottom: 2,
//           paddingTop: 2,
//           mb: 4,
//         }}
//       >
//         <Typography variant="h4" fontWeight="bold" mb={2} textAlign="left">
//           Découvrez nos sélections littéraires
//         </Typography>

//         <Box
//           sx={{
//             display: "flex",
//             gap: 2,
//             justifyContent: "flex-start",
//             flexWrap: "wrap",
//           }}
//         >
//           <Autocomplete
//             options={categoriesDisponibles}
//             value={filtreCategorie}
//             onChange={(event, newValue) => setFiltreCategorie(newValue)}
//             renderInput={(params) => <TextField {...params} label="Filtrer par catégorie" />}
//             sx={{ minWidth: 200 }}
//             clearOnEscape
//           />

//           <Autocomplete
//             options={livresTous.map((livre) => livre.Titre)}
//             value={filtreTitre}
//             onChange={(event, newValue) => setFiltreTitre(newValue)}
//             renderInput={(params) => <TextField {...params} label="Rechercher un titre" />}
//             sx={{ minWidth: 200 }}
//             clearOnEscape
//           />
//         </Box>
//       </Box>

//       {/* Résultats filtrés */}
//       {filtreCategorie || filtreTitre ? (
//         <Box>
//           <Typography variant="h5" fontWeight="bold" mb={2}>
//             Résultats filtrés
//           </Typography>

//           {livresFiltres.length === 0 ? (
//             <Typography color="text.secondary">Aucun livre trouvé avec ces filtres.</Typography>
//           ) : (
//             <Box
//               sx={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 2,
//               }}
//             >
//               {livresFiltres.map((livre) => (
//                 <Card
//                   key={livre.ID_Livre}
//                   sx={{
//                     width: 160,
//                     borderRadius: 2,
//                     boxShadow: 2,
//                     transition: "transform 0.3s",
//                     "&:hover": { transform: "scale(1.05)" },
//                     zIndex: 0,
//                   }}
//                 >
//                   <Link to={`/livre/${livre.ID_Livre}`}>
//                     <CardMedia
//                       component="img"
//                       height="210"
//                       image={livre.URL_Couverture}
//                       alt={livre.Titre}
//                     />
//                   </Link>
//                   <CardContent sx={{ p: 1 }}>
//                     <Typography variant="body2" fontWeight="bold" noWrap>
//                       {livre.Titre}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary" noWrap>
//                       {livre.Auteur}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               ))}
//             </Box>
//           )}
//         </Box>
//       ) : (
//         // Affichage par catégorie
//         Object.entries(livresParCategorie).map(([categorie, livres]) => (
//           <Box key={categorie} sx={{ mb: 5 }}>
//             <Typography variant="h5" fontWeight="bold" mb={2}>
//               {categorie}
//             </Typography>

//             <Box
//               sx={{
//                 display: "flex",
//                 overflowX: "auto",
//                 gap: 2,
//                 paddingBottom: 1,
//                 scrollSnapType: "x mandatory",
//                 "&::-webkit-scrollbar": { height: 6 },
//                 "&::-webkit-scrollbar-thumb": {
//                   backgroundColor: "#bbb",
//                   borderRadius: 10,
//                 },
//               }}
//             >
//               {livres.map((livre) => (
//                 <Card
//                   key={livre.ID_Livre}
//                   sx={{
//                     minWidth: 160,
//                     maxWidth: 160,
//                     scrollSnapAlign: "start",
//                     flexShrink: 0,
//                     borderRadius: 2,
//                     boxShadow: 2,
//                     transition: "transform 0.3s",
//                     "&:hover": { transform: "scale(1.05)" },
//                     zIndex: 0,
//                   }}
//                 >
//                   <Link to={`/livre/${livre.ID_Livre}`}>
//                     <CardMedia
//                       component="img"
//                       height="210"
//                       image={livre.URL_Couverture}
//                       alt={livre.Titre}
//                     />
//                   </Link>
//                   <CardContent sx={{ p: 1 }}>
//                     <Typography variant="body2" fontWeight="bold" noWrap>
//                       {livre.Titre}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary" noWrap>
//                       {livre.Auteur}
//                     </Typography>

//                     {/* Tags cliquables */}
//                     {livre.Mots_Cles && (
//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: 0.5,
//                           mt: 1,
//                         }}
//                       >
//                         {livre.Mots_Cles.split(",").map((mot, index) => (
//                           <Link
//                             key={index}
//                             to={`/motcle/${mot.trim()}`}
//                             style={{ textDecoration: "none" }}
//                           >
//                             <Paper
//                               sx={{
//                                 px: 1.2,
//                                 py: 0.3,
//                                 backgroundColor: "#eee",
//                                 borderRadius: "999px",
//                                 fontSize: "0.7rem",
//                                 fontWeight: 500,
//                                 color: "#444",
//                                 "&:hover": {
//                                   backgroundColor: "#ddd",
//                                 },
//                               }}
//                             >
//                               {mot.trim()}
//                             </Paper>
//                           </Link>
//                         ))}
//                       </Box>
//                     )}
//                   </CardContent>
//                 </Card>
//               ))}
//             </Box>
//           </Box>
//         ))
//       )}
//     </Box>
//   );
// };

// export default Exploration;

import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ExplorationEmotionnelle() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/exploration_emo").then((res) => {
      setCategories(res.data);
    });
  }, []);

  return (
    <Box sx={{ px: 3, pt: 12, backgroundColor: "#f5f0e6", minHeight: "100vh" }}>
      <Typography variant="h1" gutterBottom>
        Explorer les livres par émotions 💬
      </Typography>

      {categories.map((cat) => (
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

import { CssBaseline, Box } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import Formulaire from "./pages/Formulaire";
import Exploration from "./pages/Exploration";
import ExplorationEmotionnelle from "./pages/ExplorationEmotionnelle";
import Profil from "./pages/Profil";
import About from "./pages/About";
import DetailsLivre from "./pages/DetailsLivre";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recommandations from "./pages/Recommandations";
import PageMotCle from "./pages/PageMotCle";
import ExplorationMotsCles from "./pages/ExplorationMotsCles";
import ProfilPublic from "./pages/ProfilPublic";
import MonCercle from "./pages/MonCercle";
import SidebarConnecte from "./components/SidebarConnecte";
import Bibliotheque from "./pages/Bibliotheque";

import { SidebarProvider, useSidebar } from "./context/SidebarContext.jsx";
import { UserProvider, useUser } from "./context/UserContext";

function Layout() {
  const { utilisateur } = useUser();
  const { isSidebarOpen } = useSidebar();

  return (
    <>
      <Navbar />
      {utilisateur && <SidebarConnecte />}
      <Box
        sx={{
          ml: utilisateur ? (isSidebarOpen ? "230px" : "70px") : 0,
          pt: 8,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/formulaire" element={<Formulaire />} />
          <Route path="/exploration" element={<Exploration />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/about" element={<About />} />
          <Route path="/livre/:id" element={<DetailsLivre />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recommandations" element={<Recommandations />} />
          <Route path="/motcle/:tag" element={<PageMotCle />} />
          <Route path="/exploration-emo" element={<ExplorationEmotionnelle />} />
          <Route path="/utilisateur/:id" element={<ProfilPublic />} />
          <Route path="/motscles" element={<ExplorationMotsCles />} />
          <Route path="/mon-cercle" element={<MonCercle />} />
          <Route path="/bibliotheque" element={<Bibliotheque />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <UserProvider>
          <SidebarProvider>
            <Layout />
          </SidebarProvider>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

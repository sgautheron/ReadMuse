import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import Formulaire from "./pages/Formulaire";
import Exploration from "./pages/Exploration";
import Profil from "./pages/Profil";
import About from "./pages/About";
import DetailsLivre from "./pages/DetailsLivre";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recommandations from "./pages/Recommandations";
import PageMotCle from "./pages/PageMotCle";
import ExplorationMotsCles from "./pages/ExplorationMotsCles";

import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <UserProvider>
          <Navbar />
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
            <Route path="/motscles" element={<ExplorationMotsCles />} /> {/* ✅ correction ici */}
          </Routes>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

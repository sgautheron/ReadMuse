import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import Formulaire from "./pages/Formulaire";
import Exploration from "./pages/Exploration";
import Historique from "./pages/Historique";
import About from "./pages/About";
import DetailsLivre from "./pages/DetailsLivre";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/formulaire" element={<Formulaire />} />
          <Route path="/exploration" element={<Exploration />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/about" element={<About />} />
          <Route path="/livre/:id" element={<DetailsLivre />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

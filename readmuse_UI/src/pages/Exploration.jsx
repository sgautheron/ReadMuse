import React from "react";
import Livres from "../components/Livres"; // Import du composant qui affiche les livres

const Exploration = () => {
  return (
    <div>
      <h1>ReadMuse</h1>
      <h2>📖 Vos recommandations</h2>
      <Livres /> {/* Affichage des livres ici */}
    </div>
  );
};

export default Exploration;

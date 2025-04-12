import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(() => {
    const storedUser = localStorage.getItem("utilisateur");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ Mémorise dans localStorage quand l'utilisateur change
  useEffect(() => {
    if (utilisateur) {
      localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
    } else {
      localStorage.removeItem("utilisateur");
    }
  }, [utilisateur]);

  return (
    <UserContext.Provider value={{ utilisateur, setUtilisateur }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

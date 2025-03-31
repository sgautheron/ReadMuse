// src/context/UserContext.js
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null); // null = pas connecté

  return (
    <UserContext.Provider value={{ utilisateur, setUtilisateur }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

"use client";
import { createContext, useContext, useState } from "react";

const GlobalDataAccesContext = createContext();

export function GlobalDataAccesContextProvider({ children }) {
  const [userToProfile, setUserToProfile] = useState();

  return (
    <GlobalDataAccesContext.Provider
      value={{ userToProfile, setUserToProfile }}
    >
      {children}
    </GlobalDataAccesContext.Provider>
  );
}

export function useData() {
  const context = useContext(GlobalDataAccesContext);
  if (!context) return console.error("Error al usar useData");
  return context;
}

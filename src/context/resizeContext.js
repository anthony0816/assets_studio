"use client";
import { createContext, useContext, useEffect, useState } from "react";
const sizeContext = createContext();

export function SizeContextProvider({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Definimos la media query
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    // Función para actualizar el estado
    const handleChange = (e) => setIsMobile(e.matches);

    // Estado inicial
    setIsMobile(mediaQuery.matches);

    // Escuchar cambios
    mediaQuery.addEventListener("change", handleChange);

    // Limpiar al desmontar
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <sizeContext.Provider value={{ isMobile }}>
        {children}
      </sizeContext.Provider>
    </>
  );
}

export function useSize() {
  const context = useContext(sizeContext);
  if (!context) {
    console.error("El useSize() debe ser usnado dentro del contexto");
    return;
  }
  return context;
}

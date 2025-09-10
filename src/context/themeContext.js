"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { CurrentTheme, Theme } from "@/themes/themes";

const themeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [isBlackTheme, setIsBlackTheme] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(CurrentTheme);

  useEffect(() => {
    if (isBlackTheme) {
      setCurrentTheme(Theme.blackTheme);
      return;
    }
    setCurrentTheme(Theme.whiteTheme);
  }, [isBlackTheme]);

  return (
    <themeContext.Provider value={{ currentTheme, setIsBlackTheme }}>
      {children}
    </themeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(themeContext);
  if (!context)
    return console.error("debe usarse el useTheme dentro del provider");
  return context;
}

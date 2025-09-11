"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChange } from "@/firebase/client";
import { loginWithGoogle, loginWithGitHub } from "@/firebase/client";
import { logout } from "@/firebase/client";

const AuthContext = createContext();

export default function AuthContextProvaider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    onAuthStateChange(setUser);
  }, []);

  const loginGoogle = async () => {
    const loguedUser = await loginWithGoogle();
    setUser(loguedUser);
  };

  const loginGithub = async () => {
    const loguedUser = await loginWithGitHub();
    setUser(loguedUser);
  };

  return (
    <>
      <AuthContext.Provider value={{ user, loginGithub, loginGoogle, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    return console.error(" useAuth() Debe ser usado dentro del provider");
  return context;
}

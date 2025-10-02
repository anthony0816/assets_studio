"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChange } from "@/firebase/client";
import { loginWithGoogle, loginWithGitHub } from "@/firebase/client";
import { logout } from "@/firebase/client";

const AuthContext = createContext();

export default function AuthContextProvaider({ children }) {
  const [user, setUser] = useState("await");

  console.log("current user:", user);

  useEffect(() => {
    onAuthStateChange(setUser);
  }, []);

  useEffect(() => {
    async function exe() {
      if (user == null) {
        const res = await fetch("/api/session/verify-jwt", {
          method: "GET",
          credentials: "include",
        });
        const { success, error } = await res.json();
        if (error) alert("error de sesion");
      }
    }
    exe();
  }, [user]);

  const loginGoogle = async () => {
    const loguedUser = await loginWithGoogle();
    setUser(loguedUser);
  };

  const loginGithub = async () => {
    const loguedUser = await loginWithGitHub();
    setUser(loguedUser);
  };

  const logoutJWT = async () => {
    const res = await fetch("api/session/delete-jwt", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
    });
    return res;
  };

  return (
    <>
      <AuthContext.Provider
        value={{ user, setUser, loginGithub, loginGoogle, logout, logoutJWT }}
      >
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

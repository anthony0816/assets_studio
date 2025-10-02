"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChange } from "@/firebase/client";
import { loginWithGoogle, loginWithGitHub } from "@/firebase/client";
import { logout } from "@/firebase/client";
import { CreateJWTCookieSession } from "@/utils/functions";

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
        const data = await res.json();
        const { success, error, user } = data;
        if (success) {
          const res = await fetch(
            `api/user/get-local-user?email=${user.email}`
          );
          const { currentUser, error } = await res.json();
          if (currentUser) return setUser(currentUser);
          if (error) return console.error("Error al buscar el usuario:", error);
        }
        console.log("Sesion state:", data);
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
    if (res.ok) setUser(null);
    return res;
  };

  const loginJWT = async (name, password) => {
    const res = await fetch("/api/user/get-by-name-pass", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify({
        name,
        password,
      }),
    });

    if (res.status == 500) {
      alert("unknow autentification error, try again later");
      return undefined;
    }

    const { error, user } = await res.json();
    if (user) {
      const res = await CreateJWTCookieSession(user.email);
      const { success } = await res.json();
      if (success) {
        setUser(user);
        return true;
      }
    }
    if (error) {
      console.log("error de autenticacion:", error);
      return false;
    }
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          setUser,
          loginGithub,
          loginGoogle,
          logout,
          loginJWT,
          logoutJWT,
        }}
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

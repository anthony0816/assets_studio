"use client";
import { loginWithGitHub } from "@/firebase/client";
import { loginWithGoogle } from "@/firebase/client";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

export default function TestTailwind() {
  const { user } = useAuth();

  console.log("User del contexto", user);

  async function HandleClick() {
    const res = await loginWithGitHub();
    console.log("respuesta Firebase", res);
  }

  async function HandleClick2() {
    const user = await loginWithGoogle();
    console.log("respuesta google", res);
    setUser(user);
  }

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg text-center">
      <h1 className="text-3xl font-bold text-white mb-4">
        ✅ Tailwind está funcionando
      </h1>
      <p className="text-white/90">
        Si ves este bloque con colores degradados, bordes redondeados y sombra,
        Tailwind está activo.
      </p>
      <button
        onClick={HandleClick}
        className="mt-4 px-4 py-2 bg-white text-indigo-600 font-semibold rounded hover:bg-indigo-100 transition"
      >
        Github
      </button>
      <button
        onClick={HandleClick2}
        className="mt-4 px-4 py-2 bg-white text-indigo-600 font-semibold rounded hover:bg-indigo-100 transition"
      >
        Google
      </button>
      {user == undefined && <p>Usuario indefinido</p>}
      {user == null && <p>user null</p>}
      {user && <p>logued</p>}
    </div>
  );
}

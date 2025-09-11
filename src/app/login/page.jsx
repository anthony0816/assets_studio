"use client";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";

export default function Login() {
  const { currentTheme } = useTheme();
  const { loginGoogle, loginGithub } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div
        className={`${currentTheme.colors.third} p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6`}
      >
        <h1 className="text-2xl font-bold text-center">Bienvenido</h1>

        <div className="space-y-3">
          <button
            onClick={loginGoogle}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
          >
            Iniciar sesión con Google
          </button>

          <button
            onClick={loginGithub}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            Iniciar sesión con GitHub
          </button>

          <button className="w-full flex items-center justify-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition">
            Crear cuenta
          </button>
        </div>

        <div className="text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <a href="#" className="text-indigo-400 hover:underline">
            Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
}

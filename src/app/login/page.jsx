"use client";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";

export default function Login() {
  const { currentTheme } = useTheme();
  const { loginGoogle, loginGithub } = useAuth();

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${currentTheme.colors.primary} ${currentTheme.textColor.primary}`}
    >
      <div
        className={`${currentTheme.colors.third} p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6`}
      >
        <h1 className="text-2xl font-bold text-center">Bienvenido</h1>

        <div className="space-y-3">
          <button
            onClick={loginGoogle}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition ${currentTheme.colors.buttonGoogle} ${currentTheme.colors.buttonGoogleHover} ${currentTheme.textColor.primary}`}
          >
            Iniciar sesión con Google
          </button>

          <button
            onClick={loginGithub}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition ${currentTheme.colors.buttonGithub} ${currentTheme.colors.buttonGithubHover} ${currentTheme.textColor.primary}`}
          >
            Iniciar sesión con GitHub
          </button>

          <button
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} text-white`}
          >
            Crear cuenta
          </button>
        </div>

        <div className={`text-center text-sm ${currentTheme.textColor.muted}`}>
          ¿Ya tienes una cuenta?{" "}
          <a
            href="#"
            className={`${currentTheme.textColor.link} hover:underline`}
          >
            Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
}

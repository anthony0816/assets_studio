"use client";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";
import { useLoadingRouter } from "@/Components/LoadingRouterProvider";
import { useState } from "react";
import LoadingSpinner from "@/Components/LoadingSpiner";

export default function Login() {
  const { currentTheme } = useTheme();
  const { loginGoogle, loginGithub, loginJWT } = useAuth();
  const { router } = useLoadingRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [username, setUsername] = useState("");
  const [pass, setPas] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (username.trim() == "" || pass.trim() == "") return;
    setError(false);
    setLoading(true);
    const success = await loginJWT(username, pass);
    if (success) {
      setLoading(false);
      router("/allAssets");
      return;
    }
    setError(true);
    setLoading(false);
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${currentTheme.colors.primary} ${currentTheme.textColor.primary}`}
    >
      <div
        className={`${currentTheme.colors.third} p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6`}
      >
        <h1 className="text-2xl font-bold text-center">Wellcome</h1>

        {error ? (
          <div className="text-center text-red-600">
            Username or Password is incorrect
          </div>
        ) : null}

        {/* New login form */}
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4 mb-15">
          <input
            required
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${currentTheme.colors.input} ${currentTheme.colors.inputFocus} ${currentTheme.textColor.primary}`}
          />
          <input
            required
            onChange={(e) => setPas(e.target.value)}
            type="password"
            placeholder="Password"
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${currentTheme.colors.input} ${currentTheme.colors.inputFocus} ${currentTheme.textColor.primary}`}
          />
          <button
            type="submit"
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} text-white`}
          >
            {loading ? <LoadingSpinner color="white" /> : "Sign In"}
          </button>
        </form>

        <div className="space-y-3">
          <button
            onClick={loginGoogle}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition ${currentTheme.colors.buttonGoogle} ${currentTheme.colors.buttonGoogleHover} ${currentTheme.textColor.primary}`}
          >
            Sing with con Google
          </button>

          <button
            onClick={loginGithub}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition ${currentTheme.colors.buttonGithub} ${currentTheme.colors.buttonGithubHover} ${currentTheme.textColor.primary}`}
          >
            Sing with con GitHub
          </button>

          <button
            onClick={() => router("/registrar")}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} text-white`}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

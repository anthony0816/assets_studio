"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/context/themeContext";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentTheme } = useTheme();

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ia/promp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setImageUrl(data.imageUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-5 max-w-[600px] ${currentTheme.colors.primary} ${currentTheme.textColor.primary}`}
    >
      <h1>Generador de Imágenes con IA</h1>

      <div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe la imagen que quieres generar..."
          rows="3"
          className={`w-full mb-2 p-2 rounded ${currentTheme.colors.secondary} ${currentTheme.textColor.primary}`}
        />

        <button
          onClick={generateImage}
          disabled={loading}
          className={`px-5 py-2 rounded ${
            loading
              ? currentTheme.colors.mutedText
              : currentTheme.colors.buttonPrimary
          } ${
            !loading && currentTheme.colors.buttonPrimaryHover
          } text-white border-none transition`}
        >
          {loading ? "Generando..." : "Generar Imagen"}
        </button>
      </div>

      {error && (
        <div className={`${currentTheme.colors.errorText} mt-2`}>
          Error: {error}
        </div>
      )}

      {imageUrl && (
        <div className="relative w-[512px] h-[512px] mt-5">
          <Image
            src={imageUrl}
            alt="Imagen generada"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
}

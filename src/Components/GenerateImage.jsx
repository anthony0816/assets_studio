"use client";

import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-image", {
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
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Generador de Imágenes con IA</h1>

      <div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe la imagen que quieres generar..."
          rows="3"
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button
          onClick={generateImage}
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: loading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
          }}
        >
          {loading ? "Generando..." : "Generar Imagen"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>Error: {error}</div>
      )}

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Resultado:</h2>
          <img
            src={imageUrl}
            alt="Imagen generada"
            style={{ maxWidth: "100%", border: "1px solid #ddd" }}
          />
        </div>
      )}
    </div>
  );
}

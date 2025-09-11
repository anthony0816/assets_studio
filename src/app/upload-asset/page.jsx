"use client";
import { useTheme } from "@/context/themeContext";
import { useState } from "react";

import { fileToBase64 } from "@/utils/functions";

export default function UploadAsset() {
  const { currentTheme } = useTheme();
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const base64file = await fileToBase64(file);
    console.log(base64file);
  }

  return (
    <div
      className={`min-h-screen ${currentTheme.colors.primary} text-white flex items-center justify-center p-6`}
    >
      <div
        className={`${currentTheme.colors.third} rounded-lg shadow-lg w-full max-w-lg p-8 space-y-6`}
      >
        <h1 className="text-2xl font-bold text-center">Upload Asset</h1>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          {/* SRC */}
          <div className="w-full  flex text-center">
            <label className="w-full  border h-40 text-white font-medium py-2 px-4 rounded-lg transition">
              find your asset in local store
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                placeholder="https://..."
                className={`hidden`}
              />
            </label>
          </div>

          {/* Botón */}
          <div className="pt-4">
            <button
              type="submit"
              className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition ${
                !file && "opacity-50"
              }`}
            >
              Create Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

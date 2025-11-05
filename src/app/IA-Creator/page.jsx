"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "@/context/themeContext";
import { DownloadIcon } from "@/Icons/DownloadIcon";
import { SaveIcon } from "@/Icons/SaveIcon";
import LoadingSpinner from "@/Components/LoadingSpiner";
import { CreateAsset } from "@/utils/functions";
import { useAuth } from "@/context/authContext";
import { downloadImgFromBase64 } from "@/utils/functions";
import { RetryIcon } from "@/Icons/RetryIcon";
import ModalSelectKeyWordsAICreator from "@/Components/ModalSelectKeyWordsAICreator";

export default function ImageGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [error, setError] = useState("");
  const { currentTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  const buttomStyle = `px-6 py-2 rounded-md font-medium 
          ${
            loading
              ? currentTheme.colors.mutedText
              : currentTheme.colors.buttonPrimary
          } 
          ${!loading && currentTheme.colors.buttonPrimaryHover} 
          text-white transition duration-300`;

  async function handleSave() {
    if (loading) return;
    if (!user) return;
    if (saving) return;
    setSaveError(false);
    setSaving(true);
    setModalOpen(true);
  }

  async function HandleCreate(keyWords) {
    const data = await CreateAsset(
      imageUrl,
      user?.uid,
      user?.providerId,
      "ia",
      keyWords
    );
    const { error } = data;
    if (error) setSaveError(true);
    setSaving(false);
  }

  function handleDowload() {
    if (loading) return;
    downloadImgFromBase64(imageUrl, "asset.png");
    console.log("downloading..");
  }

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
      console.log("data", data);
      setImageUrl(data.imageUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  h-[100%] overflow-y-auto">
      <div className=" relative flex items-center justify-center min-h-screen ">
        {/* Modal para las palabras clave  */}
        <ModalSelectKeyWordsAICreator
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSucces={(keyWords) => HandleCreate(keyWords)}
        />
        <div
          className={`p-8 max-w-[600px] w-full rounded-lg shadow-lg text-center 
      ${currentTheme.colors.primary} ${currentTheme.textColor.primary}`}
        >
          <h1 className="text-2xl font-bold mb-4">AI Image Generator</h1>

          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              rows="3"
              className={`w-full mb-4 p-3 rounded-md resize-none 
          ${currentTheme.colors.secondary} ${currentTheme.textColor.primary}`}
            />

            {/* buttoms */}
            <div className="flex justify-around space-x-2">
              {imageUrl && (
                <button onClick={handleSave} className={buttomStyle}>
                  {saving ? (
                    <LoadingSpinner color="white" />
                  ) : saveError ? (
                    <RetryIcon />
                  ) : (
                    <SaveIcon />
                  )}
                </button>
              )}
              <button
                onClick={generateImage}
                disabled={loading}
                className={buttomStyle}
              >
                {loading ? <LoadingSpinner /> : "Generate"}
              </button>
              {imageUrl && (
                <button onClick={handleDowload} className={buttomStyle}>
                  <DownloadIcon />
                </button>
              )}
            </div>
          </div>

          {error && (
            <div
              className={`${currentTheme.colors.errorText} mt-3 font-medium`}
            >
              Error: {error}
            </div>
          )}

          {imageUrl && (
            <div className="relative w-full h-[512px] mt-6 mx-auto ">
              <Image
                src={imageUrl}
                alt="Generated image"
                fill
                className="object-contain rounded-md shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

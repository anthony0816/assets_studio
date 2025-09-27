"use client";
import { useTheme } from "@/context/themeContext";
import { useEffect, useState } from "react";
import { CreateAsset } from "@/utils/functions";
import { useAuth } from "@/context/authContext";
import LoadingSpinner from "@/Components/LoadingSpiner";
import { useLoadingRouter } from "@/Components/LoadingRouterProvider";
import CategorySelector from "@/Components/CategorySelector";
import DeleteIcon from "@/Icons/DeleteIcon";

import { fileToBase64 } from "@/utils/functions";

export default function UploadAsset() {
  const { currentTheme } = useTheme();
  const [file, setFile] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { user } = useAuth();
  const { router } = useLoadingRouter();

  useEffect(() => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }, [file]);

  async function handleSubmit(e) {
    if (isLoading) return;
    setIsLoading(true);
    e.preventDefault();
    if (!categoria) return setIsLoading(false);
    const base64file = await fileToBase64(file);
    if (!user) {
      setIsLoading(false);
      router("/login");
      return;
    }
    const data = await CreateAsset(
      base64file,
      user?.id,
      user?.uid,
      user?.providerId,
      categoria
    );
    setFile(null);
    setIsLoading(false);
    setCategoria("");
    console.log("BAckend Create Asset", data);
  }

  return (
    <div className="h-[100%] overflow-y-auto">
      <div
        className={`min-h-screen  ${currentTheme.colors.primary} ${currentTheme.textColor.primary} flex items-center justify-center p-6`}
      >
        <div
          className={`${currentTheme.colors.third} rounded-lg shadow-lg w-full max-w-lg p-8 space-y-6`}
        >
          <h1 className="text-2xl font-bold text-center">Upload Asset</h1>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            {/* SRC */}
            <div className="w-full flex text-center">
              {!file && (
                <label
                  className={`w-full border ${currentTheme.colors.border} ${currentTheme.textColor.primary} font-medium py-2 px-4 h-40 rounded-lg transition cursor-pointer flex items-center justify-center`}
                >
                  find your asset in local store
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    placeholder="https://..."
                    className="hidden"
                  />
                </label>
              )}

              {file && (
                <div className="relative mx-auto ">
                  <div
                    onClick={() => setFile(null)}
                    className="absolute right-2 bottom-2 bg-gray-800/90 p-4 hover:bg-gray-800 transition rounded-xl "
                  >
                    <DeleteIcon />
                  </div>
                  <img src={preview} className="object-cover rounded"></img>
                </div>
              )}
            </div>

            {/* Categoría */}
            <div className="flex flex-col justify-center items-center">
              <select
                required
                onChange={(e) => {
                  if (e.target.value.startsWith("cat-")) {
                    return setCategoria(e.target.value.split("-")[1]);
                  }
                  setCategoria(e.target.value);
                }}
                className={`w-[90%] whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${currentTheme.colors.primary} ${currentTheme.textColor.secondary}`}
              >
                <option value="">Select a category</option>
                <CategorySelector />
              </select>
            </div>

            {/* Botón */}
            <div className="pt-4">
              <button
                disabled={file == null || isLoading}
                type="submit"
                className={`w-full ${currentTheme.colors.buttonPrimary} ${
                  currentTheme.colors.buttonPrimaryHover
                } text-white font-medium py-2 px-4 rounded-lg transition ${
                  !file && "opacity-50"
                }`}
              >
                {isLoading ? <LoadingSpinner color="white" /> : "Upload Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

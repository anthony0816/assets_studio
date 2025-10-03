"use client";
import { useTheme } from "@/context/themeContext";
import { UploadIcon } from "@/Icons/UploadIcon";
import { fileToBase64 } from "@/utils/functions";
import { useState } from "react";
import DeleteIcon from "@/Icons/DeleteIcon";

export default function UploadAvatar({ onSucces }) {
  const { currentTheme } = useTheme();
  const [imgUrl, setImgUrl] = useState(null);

  async function handleUpload(file) {
    const base64 = await fileToBase64(file);
    setImgUrl(base64);
    onSucces(base64);
  }

  return (
    <>
      <section className=" flex flex-col justify-center space-y-4  w-full">
        {/* preview de la imagen  */}

        <div className=" w-full h-full ">
          {imgUrl && (
            <>
              <div className="relative">
                <div
                  onClick={() => setImgUrl(null)}
                  className="absolute right-2 bottom-2 bg-gray-800/90 p-4 hover:bg-gray-800 transition rounded-xl "
                >
                  <DeleteIcon />
                </div>
                <img
                  className="w-full h-100 object-cover rounded"
                  src={imgUrl}
                  alt="Foto de perfil"
                />
              </div>
            </>
          )}
        </div>

        {/* Boton de subir imagen */}
        <div className=" mx-auto ">
          <label htmlFor="uploaderAvatarUser">
            <div
              className={`px-4 py-2 rounded text-white font-medium 
        ${currentTheme.colors.buttonPrimary} 
        ${currentTheme.colors.buttonPrimaryHover} transition`}
            >
              {imgUrl ? "change" : <UploadIcon />}
            </div>
          </label>
        </div>

        <input
          onChange={(e) => handleUpload(e.target.files[0])}
          id="uploaderAvatarUser"
          type="file"
          hidden
        />
      </section>
    </>
  );
}

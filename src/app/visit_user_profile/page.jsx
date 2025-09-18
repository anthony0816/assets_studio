"use client";
import { useData } from "@/context/GlobalDataAccesContext";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";
import AssetsCard from "@/Components/AssetsCard";
import { GetAssetsByUserId } from "@/utils/functions";
import ModalShowPicture from "@/Components/ModalShowPicture";
import ModalAssetData from "@/Components/ModalAssetData";

export default function UserProfile() {
  const storage = useData();
  const [user, setUser] = useState("");
  const [assets, setAssets] = useState([]);
  const { currentTheme } = useTheme();
  const auth = useAuth();
  const [page, setPage] = useState(0);
  const freeAcces = true;
  const limit = 10;

  const ModalShowPictueRef = useRef();
  const ModalAssetOptionsRef = useRef();

  useEffect(() => {
    const user = storage.userToProfile;
    setUser(user);
  }, [storage.userToProfile]);

  useEffect(() => {
    if (user == "") return;
    async function loadAssets() {
      const data = await GetAssetsByUserId(
        user?.uid,
        user?.id,
        user?.providerId,
        page,
        limit,
        freeAcces
      );
      console.log("AssetsCard", data);
      const { error } = data;
      if (error) {
        return console.error("error", error, error.messaje || "unknown");
      }
      setAssets(data);
    }
    loadAssets();
  }, [user]);

  {
    /* Modales */
  }

  function onClickBar(asset) {
    if (ModalAssetOptionsRef.current) {
      const modal = ModalAssetOptionsRef.current;
      modal.open(asset);
    }
  }

  function onClickPhoto(asset) {
    if (ModalShowPictueRef.current) {
      ModalShowPictueRef.current.open(asset);
    }
  }

  function nextAsset() {
    const modal = ModalShowPictueRef.current;
    const currentAsset = modal.currentAsset();
    const index = assets.indexOf(currentAsset);
    const nextIndex = (index + 1) % assets.length;
    modal.foward(assets[nextIndex]);
  }

  function prevAsset() {
    const modal = ModalShowPictueRef.current;
    const currentAsset = modal.currentAsset();
    const index = assets.indexOf(currentAsset);
    const prevIndex = (index - 1 + assets.length) % assets.length;
    modal.backwards(assets[prevIndex]);
  }

  if (!user) return null;

  return (
    <>
      <ModalShowPicture
        ref={ModalShowPictueRef}
        nextAsset={() => {
          nextAsset();
        }}
        prevAsset={() => {
          prevAsset();
        }}
      />

      <ModalAssetData ref={ModalAssetOptionsRef} onClose={() => null} />

      <div
        className={`${currentTheme.colors.primary} min-h-screen p-6 h-[100%] overflow-auto`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header del perfil */}
          <div
            className={`${currentTheme.colors.third} rounded-lg shadow-lg p-6 mb-6`}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-32 h-32 mb-4 md:mb-0 md:mr-6">
                <img
                  src={user.photoURL}
                  alt="Foto de perfil"
                  className={`w-full h-full object-cover rounded-full border-4 ${currentTheme.colors.border}`}
                />
              </div>
              <div className="text-center md:text-left">
                <h1
                  className={`${currentTheme.textColor.primary} text-3xl font-bold`}
                >
                  {user.displayName}
                </h1>
                <p className={`${currentTheme.textColor.muted} mt-2`}>
                  {user.email}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start mt-4 gap-2">
                  <span
                    className={`${currentTheme.colors.secondary} ${currentTheme.textColor.secondary} px-3 py-1 rounded-full text-sm`}
                  >
                    Usuario
                  </span>
                  <span
                    className={`${currentTheme.colors.buttonGoogle} text-white px-3 py-1 rounded-full text-sm`}
                  >
                    Google
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Información de la cuenta */}
          <div
            className={`${currentTheme.colors.third} rounded-lg shadow-lg p-6 mb-6`}
          >
            <h2
              className={`${currentTheme.textColor.primary} text-xl font-semibold mb-4`}
            >
              Información de la cuenta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`${currentTheme.colors.secondary} p-4 rounded-lg`}
              >
                <p className={`${currentTheme.textColor.muted} text-sm`}>
                  Provider
                </p>
                <p className={`${currentTheme.textColor.secondary}`}>
                  {user.providerData[0]?.providerId || "Google"}
                </p>
              </div>

              <div
                className={`${currentTheme.colors.secondary} p-4 rounded-lg`}
              >
                <p className={`${currentTheme.textColor.muted} text-sm`}>
                  Created at
                </p>
                <p className={`${currentTheme.textColor.secondary}`}>
                  {user.metadata.creationTime}
                </p>
              </div>

              <div
                className={`${currentTheme.colors.secondary} p-4 rounded-lg`}
              >
                <p className={`${currentTheme.textColor.muted} text-sm`}>
                  Last seen
                </p>
                <p className={`${currentTheme.textColor.secondary}`}>
                  {user.metadata.lastSignInTime}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Imagenes */}
        <div className="">
          <h2
            className={`${currentTheme.textColor.primary} text-xl font-semibold mb-4`}
          >
            Assets
          </h2>
          <div className="grid gap-6 p-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
            {assets.map((asset) => (
              <AssetsCard
                key={asset.id}
                asset={asset}
                currentUserId={auth.user?.uid}
                onClickBar={() => onClickBar(asset)}
                onClickPhoto={onClickPhoto}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

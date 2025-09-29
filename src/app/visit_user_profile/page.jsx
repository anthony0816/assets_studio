"use client";
import { useData } from "@/context/GlobalDataAccesContext";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/authContext";
import AssetsCard from "@/Components/AssetsCard";
import { GetAssetsByUserId } from "@/utils/functions";
import ModalShowPicture from "@/Components/ModalShowPicture";
import ModalAssetData from "@/Components/ModalAssetData";
import { useSize } from "@/context/resizeContext";
import { FetchUserData } from "@/utils/functions";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const storage = useData();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState("");
  const [assets, setAssets] = useState([]);
  const { currentTheme } = useTheme();
  const auth = useAuth();
  const [page, setPage] = useState(0);
  const [modalAssetsDataisOpen, setModalAssetsDataisOpen] = useState(false);
  const [hideMainContent, setHideMainContent] = useState(false);
  const [loadingUserDataError, setloadingUserDataError] = useState(false);
  const router = useRouter();
  const freeAcces = true;
  const limit = 10;

  const ModalShowPictueRef = useRef();
  const ModalAssetOptionsRef = useRef();
  const loadingRef = useRef();
  const { isMobile } = useSize();

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
      return console.error("error", error, error.messaje || "unknown");
    }
    setAssets((prev) => {
      const ids = new Set(prev.map((a) => a.id));
      const nuevos = data.filter((a) => !ids.has(a.id));
      return [...prev, ...nuevos];
    });
    setPage((prev) => prev + 1);
    if (data.length < limit) setHasMore(false);

    setIsLoading(false);
  });

  useEffect(() => {
    async function LoadUserData(params) {
      const user = storage.userToProfile;
      const { user_id } = user;
      if (user_id) {
        console.log("success");
        const res = await FetchUserData(user_id);
        const userData = await res.json();
        console.log("Datos Perfil visitar el suuario:", userData);
        if (userData.error) return setloadingUserDataError(true);
        setUser(userData);
        return;
      }
      setUser(user);
    }
    LoadUserData();
  }, [storage.userToProfile]);

  useEffect(() => {
    if (user == "") return;
    loadAssets();
  }, [user]);

  useEffect(() => {
    if (!loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (isLoading) return console.log("STOP_Loading...");
          console.log("El elemento está visible, cargar más datos...");
          if (hasMore) loadAssets();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    const target = loadingRef.current;

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadAssets, hasMore]);

  {
    /* Modales */
  }

  function onClickBar(asset) {
    if (ModalAssetOptionsRef.current) {
      const modal = ModalAssetOptionsRef.current;
      if (isMobile) {
        setTimeout(() => {
          setHideMainContent(true);
        }, 300);
      }
      setModalAssetsDataisOpen(true);
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

  if (loadingUserDataError) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-[60vh] 
                  ${currentTheme.colors.primary} ${currentTheme.textColor.primary}`}
      >
        <h2
          className={`text-2xl font-bold mb-4 ${currentTheme.colors.errorText}`}
        >
          ❌ Failed to load user data
        </h2>

        <p className={`mb-6 ${currentTheme.textColor.secondary}`}>
          Please try again later
        </p>

        <button
          onClick={() => router.push("/allAssets")}
          className={`rounded-lg px-4 py-2 font-semibold 
                    ${currentTheme.colors.buttonPrimary} 
                    ${currentTheme.colors.buttonPrimaryHover} 
                    ${currentTheme.textColor.primary}`}
        >
          ⬅ Back to Home
        </button>
      </div>
    );
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

      <div className="flex flex-row overflow-auto h-[100%]">
        <div
          className={` transition-all duration-300 ${
            modalAssetsDataisOpen ? "w-full" : "w-0"
          } `}
        >
          <ModalAssetData
            ref={ModalAssetOptionsRef}
            onClose={() => {
              setModalAssetsDataisOpen(false);
              setHideMainContent(false);
            }}
          />
        </div>

        <div
          className={` transition-all duration-300  ${
            hideMainContent ? "hidden" : ""
          }  ${currentTheme.colors.primary} ${
            modalAssetsDataisOpen ? (isMobile ? "w-0" : "w-full") : "w-full"
          } p-1 h-[100%] overflow-auto`}
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
                className={`${currentTheme.textColor.primary} whitespace-nowrap text-xl font-semibold mb-4`}
              >
                Información de la cuenta
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`${currentTheme.colors.secondary} p-4 rounded-lg`}
                >
                  <p
                    className={` whitespace-nowrap ${currentTheme.textColor.muted} text-sm`}
                  >
                    Provider
                  </p>
                  <p
                    className={` whitespace-nowrap ${currentTheme.textColor.secondary}`}
                  >
                    {user.providerData[0]?.providerId || "Google"}
                  </p>
                </div>

                <div
                  className={`${currentTheme.colors.secondary} p-4 rounded-lg`}
                >
                  <p
                    className={` whitespace-nowrap ${currentTheme.textColor.muted} text-sm`}
                  >
                    Created at
                  </p>
                  <p
                    className={` whitespace-nowrap ${currentTheme.textColor.secondary}`}
                  >
                    {user.metadata.creationTime}
                  </p>
                </div>

                <div
                  className={`${currentTheme.colors.secondary} p-4 rounded-lg`}
                >
                  <p
                    className={` whitespace-nowrap ${currentTheme.textColor.muted} text-sm`}
                  >
                    Last seen
                  </p>
                  <p
                    className={` whitespace-nowrap ${currentTheme.textColor.secondary}`}
                  >
                    {user.metadata.lastSignInTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Imagenes */}
          <div className=" ">
            <h2
              className={`${currentTheme.textColor.primary} text-xl font-semibold mb-4 `}
            >
              Assets
            </h2>
            <div className="grid gap-6 p-4  [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
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
            {hasMore ? (
              <div
                ref={loadingRef}
                className="h-16 flex flex-col items-center justify-center gap-2 mb-20 "
              >
                {/* Spinner */}
                <div
                  className={`w-6 h-6 border-4 ${currentTheme.colors.spinner} border-t-transparent rounded-full animate-spin`}
                ></div>
                {/* Texto */}
                <span
                  className={`text-sm ${currentTheme.colors.subtleText} animate-pulse`}
                >
                  Cargando más assets...
                </span>
              </div>
            ) : (
              <div
                className={`py-6 text-center text-sm mb-20 ${currentTheme.colors.mutedText}`}
              >
                No more items to load
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

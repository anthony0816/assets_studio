"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/themeContext";
import AssetsCard from "@/Components/AssetsCard";
import { GetAssetsByUserId } from "@/utils/functions";
import ModalShowPicture from "@/Components/ModalShowPicture";
import ModalAssetData from "@/Components/ModalAssetData";
import { useSize } from "@/context/resizeContext";
import { FetchUserData } from "@/utils/functions";
import { useRouter } from "next/navigation";
import { UserToFirebaseFormatInfo } from "@/utils/functions";
import ModalDeleteAsset from "@/Components/ModalDeleteAsset";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import SkeletonAnimationGrid from "@/skeletons/SkeletonAnimationGrid";
import ModalUserProfilePhoto from "@/Components/ModalUserProfilePhoto";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(undefined);
  const [assets, setAssets] = useState(undefined);
  // size
  const { isMobile } = useSize();
  //tema
  const { currentTheme } = useTheme();
  const color = currentTheme.colors;
  const tcolor = currentTheme.textColor;
  //navegacion
  const router = useRouter();
  // Paginacion de Assets
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 24;
  // observer
  const LoaderRef = useInfiniteScroll(SearchAssets, hasMore, {
    threshold: 0.1,
  });
  // referencias
  const ModalAssetDataRef = useRef(null);
  const ModalShowPictueRef = useRef(null);

  // Modales
  const [openModalAssetData, setOpenModalAssetData] = useState(false);
  const [PhotoToModalUserProfilePhoto, setPhotoToModalUserProfilePhoto] =
    useState(null);

  // Cargar los datos del usuario
  useEffect(() => {
    async function LoadUserData() {
      // Buscar usuario en Firebase
      const res = await FetchUserData(id);
      const { f_user, error } = await res.json();

      if (f_user) {
        setUser(f_user);
        return;
      }

      /* Buscar en local db  */
      if (error) {
        const res = await fetch(
          `${window.location.origin}/api/user/get-by-uid?uid=${id}`
        );
        const { p_user, p_error, noUser } = await res.json();
        if (p_user) {
          const formatedUser = UserToFirebaseFormatInfo(p_user);
          console.log("normalizedUser: ", formatedUser);
          setUser(formatedUser);
          return;
        }
        if (p_error) {
          console.error("Error cargando el usuario:", p_error);
          setUser("error");
          return;
        }
        if (noUser) {
          setUser(null);
          return;
        }
      }
    }
    LoadUserData();
  }, []);

  // Cargar los assets del usuario
  useEffect(() => {
    if (user == null || user == "error" || user == undefined) return;
    SearchAssets();
  }, [user]);

  async function SearchAssets() {
    await GetAssetsByUserId(user.uid, page, limit, true).then((data) => {
      // manegar el error
      if (data.error) {
        setAssets("error");
        console.error("Error buscando assets:", data.error);
        return;
      }
      if (typeof assets === "string" || typeof assets === "undefined")
        setAssets(data);
      if (typeof assets === "object") setAssets((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
      if (data.length < limit) setHasMore(false);
    });
  }

  //Cambiar foto de perfil
  function ChangeAvatar(url) {
    const newUser = { ...user };
    newUser.photoURL = url;
    setUser(newUser);
  }

  // Logica de AssetCard y ModalAssetData
  function handleOnClickBar(asset) {
    console.log("Asset:", asset);
    if (ModalAssetDataRef.current) {
      const modal = ModalAssetDataRef.current;
      modal.open(asset);
      setOpenModalAssetData(true);
    }
  }
  function handleOnClickPhoto(asset) {
    if (ModalShowPictueRef.current) {
      ModalShowPictueRef.current.open(asset);
    }
  }

  function handleOnClinkComent(asset) {
    if (ModalAssetDataRef.current) {
      const modal = ModalAssetDataRef.current;
      modal.openAndCreateComent(asset);
      setOpenModalAssetData(true);
    }
  }

  // Logica ModalShowPicture
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

  // html

  if (user == "error" || user === null)
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
          Please try again later. <br />
          Also this may happen if the acount does not exist anymore
        </p>

        <button
          onClick={() => router.push("/allAssets")}
          className={`rounded-lg px-4 py-2 font-semibold 
                    ${color.buttonPrimary} 
                    ${color.buttonPrimaryHover} 
                    ${tcolor.primary}`}
        >
          ⬅ Back to Home
        </button>
      </div>
    );

  return (
    <>
      {/* Modals */}
      <ModalUserProfilePhoto
        owner={user}
        photo={PhotoToModalUserProfilePhoto}
        onClose={() => setPhotoToModalUserProfilePhoto(null)}
        onChangeAvatar={(url) => ChangeAvatar(url)}
      />
      <ModalDeleteAsset />
      <ModalShowPicture
        ref={ModalShowPictueRef}
        nextAsset={() => {
          nextAsset();
        }}
        prevAsset={() => {
          prevAsset();
        }}
      />
      <main className="flex ">
        <section
          className={` transition-all duration-300 h-[100vh] overflow-y-auto ${
            openModalAssetData ? "w-full" : "w-0"
          } `}
        >
          <ModalAssetData
            ref={ModalAssetDataRef}
            onClose={() => setOpenModalAssetData(false)}
          />
        </section>
        <section
          className={`  ${
            openModalAssetData ? (isMobile ? "w-0" : "w-full") : "w-full"
          } space-y-4 h-[100vh] overflow-y-auto`}
        >
          {/* Imagen de perfil */}

          <section
            className={`${color.third} ${tcolor.primary} mt-2 gap-3 flex flex-wrap items-center p-2 w-full max-w-[700px] mx-auto rounded-xl`}
          >
            <div className=" border w-40 h-40  mx-auto overflow-hidden rounded-full">
              {user === undefined ? (
                <>
                  <div className="w-full h-full">
                    <SkeletonAnimationGrid cellCount={1} h={999} />
                  </div>
                </>
              ) : (
                <>
                  <img
                    onClick={() =>
                      setPhotoToModalUserProfilePhoto(
                        user.photoURL != "" ? `${user.photoURL}` : "/vercel.svg"
                      )
                    }
                    src={
                      user.photoURL != "" ? `${user.photoURL}` : "/vercel.svg"
                    }
                    alt="Profile photo"
                    className={` ${color.border} object-cover w-full h-full`}
                  />
                </>
              )}
            </div>
            {/* Informacion de la cuenta */}
            <div
              className={`${color.third} text-center min-[405px]:text-left gap-4 flex-1 flex flex-col`}
            >
              {/* Nombre */}
              <span className={`text-[30px] font-bold`}>
                {user === undefined ? (
                  <div className="mx-auto w-[80%]">
                    <SkeletonAnimationGrid cellCount={1} />
                  </div>
                ) : (
                  user.displayName
                )}
              </span>
              {/* Correo*/}
              <span className={`${tcolor.muted}`}>
                {user === undefined ? (
                  <div className="mx-auto w-[70%]">
                    <SkeletonAnimationGrid cellCount={1} />
                  </div>
                ) : (
                  user.email
                )}
              </span>
              {/* Proveedor */}
              {user === undefined ? (
                <div className="flex justify-center gap-3 w-[50%] mx-auto overflow-hidden rounded-xl ">
                  <SkeletonAnimationGrid cellCount={1} />
                  <SkeletonAnimationGrid cellCount={1} />
                </div>
              ) : (
                <div className="space-x-3  ">
                  <span
                    className={` ${tcolor.secondary} ${color.secondary}  px-2 py-1 rounded-xl`}
                  >
                    Provider
                  </span>
                  <span
                    className={` whitespace-nowrap bg-red-500/80 px-2 py-1 rounded-xl`}
                  >
                    {user.providerData[0].providerId}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Metadata de la Cuenta */}
          <section
            className={` ${color.third} ${tcolor.primary} mt-2 gap-3 flex flex-col flex-wrap items-center p-4 w-full max-w-[700px] mx-auto rounded-xl`}
          >
            <h2 className={`font-bold text-center ${tcolor.primary}`}>Info</h2>
            {/* Datos  */}
            <div className=" gap-3 flex flex-row flex-wrap justify-around w-full">
              <div
                className={` ${color.secondary} min-w-50 flex-1 flex flex-col  px-4 py-2 `}
              >
                <span className={`${tcolor.muted}`}>Created at</span>
                <span>
                  {user === undefined ? (
                    <SkeletonAnimationGrid cellCount={1} />
                  ) : (
                    new Date(user.metadata.creationTime).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )
                  )}
                </span>
              </div>
              <div
                className={` ${color.secondary} min-w-50 flex-1 flex flex-col px-4 py-2`}
              >
                <span className={`${tcolor.muted}`}>Last seen</span>
                <span>
                  {user === undefined ? (
                    <SkeletonAnimationGrid cellCount={1} />
                  ) : (
                    new Date(user.metadata.lastSignInTime).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )
                  )}
                </span>
              </div>
            </div>
          </section>
          <section>
            <h2
              className={` font-bold text-center ${tcolor.primary} ${color.third}  w-full max-w-[700px] mx-auto p-3 rounded-xl`}
            >
              ASSETS
            </h2>
            {assets === undefined ? (
              <div className="p-3">
                <SkeletonAnimationGrid
                  minCellWidth={250}
                  gap={10}
                  cellCount={5}
                  h={250}
                />
              </div>
            ) : assets === "error" ? (
              "error"
            ) : (
              <>
                <div className=" mb-40 grid gap-6 p-4  [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
                  {assets.map((asset) => (
                    <AssetsCard
                      key={asset.id}
                      asset={asset}
                      onClickBar={() => handleOnClickBar(asset)}
                      onClickPhoto={handleOnClickPhoto}
                      onClickComents={() => handleOnClinkComent(asset)}
                    />
                  ))}
                  {hasMore &&
                    Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} ref={(node) => i == 0 && LoaderRef(node)}>
                        <SkeletonAnimationGrid
                          minCellWidth={250}
                          gap={1}
                          cellCount={1}
                          h={250}
                        />
                      </div>
                    ))}
                </div>
              </>
            )}
          </section>
        </section>
      </main>
    </>
  );
}

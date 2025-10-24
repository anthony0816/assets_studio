"use client";
import { useParams } from "next/navigation";

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
import { UserToFirebaseFormatInfo } from "@/utils/functions";
import ModalDeleteAsset from "@/Components/ModalDeleteAsset";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import SkeletonAnimationGrid from "@/skeletons/SkeletonAnimationGrid";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(undefined);
  const [assets, setAssets] = useState(undefined);

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

  console.log("Usuario:", user);
  console.log("Assets", assets);

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
      <main className="space-y-4 h-full overflow-y-auto ">
        {/* Imagen de perfil */}

        <section className=" bg-blue-400 mt-2 gap-3 flex flex-wrap items-center p-2 w-full max-w-[700px] h-full max-h-60 mx-auto rounded-xl ">
          <div className=" border  w-full max-w-40 h-full max-h-40 mx-auto overflow-hidden rounded-full">
            {user === undefined ? (
              <>
                <div>carga</div>
              </>
            ) : (
              <>
                <img
                  src={user.photoURL != "" ? `${user.photoURL}` : "/vercel.svg"}
                  alt="Profile photo"
                  className="object-contain w-full h-full "
                />
              </>
            )}
          </div>
          {/* Informacion de la cuenta */}
          <div className="bg-red-200 px-4  flex-1 flex flex-col ">
            {/* Nombre */}
            <span>
              {user === undefined ? "Cargando nombre" : user.displayName}
            </span>
            {/* Correp */}
            <span>{user === undefined ? "carando correo" : user.email}</span>
            {/* Proveedor */}
            <div className="space-x-3">
              <span>Provider</span>
              <span>
                {user === undefined
                  ? "cargando proveedor"
                  : user.providerData[0].providerId}
              </span>
            </div>
          </div>
        </section>

        {/* Metadata de la Cuenta */}
        <section className="bg-blue-400  mt-2 gap-3 flex flex-col flex-wrap items-center p-4 w-full max-w-[700px] h-full max-h-60 mx-auto rounded-xl  ">
          <h2>Info</h2>
          {/* Datos  */}
          <div className=" gap-3 flex flex-row flex-wrap justify-around w-full">
            <div className="  min-w-50 flex-1 flex flex-col bg-gray-400 px-4 py-2 ">
              <span>Created at</span>
              <span>
                {user === undefined
                  ? "cargando fecha"
                  : new Date(user.metadata.creationTime).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
              </span>
            </div>
            <div className="min-w-50 flex-1 flex flex-col bg-gray-400 px-4 py-2">
              <span>Last seen</span>
              <span>
                {user === undefined
                  ? "cargando fecha"
                  : new Date(user.metadata.lastSignInTime).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
              </span>
            </div>
          </div>
        </section>
        <section className="bg-blue-400  ">
          <h2 className="text-center"> Assets</h2>
          {assets === undefined ? (
            <div className="p-3">
              <SkeletonAnimationGrid
                minCellWidth={350}
                gap={10}
                cellCount={2}
                h={250}
              />
            </div>
          ) : assets === "error" ? (
            "error"
          ) : (
            <>
              <div className="grid gap-6 p-4  [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
                {assets.map((asset) => (
                  <AssetsCard
                    key={asset.id}
                    asset={asset}
                    currentUserId={user?.uid}
                    onClickBar={() => null}
                    onClickPhoto={() => null}
                  />
                ))}
                {hasMore &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} ref={(node) => i == 0 && LoaderRef(node)}>
                      <SkeletonAnimationGrid
                        minCellWidth={350}
                        gap={10}
                        cellCount={1}
                        h={250}
                      />
                    </div>
                  ))}
              </div>
            </>
          )}
        </section>
      </main>
      {/*
           const f_user = {
    uid,
    email,
    displayName: name,
    photoURL: avatar,
    providerData: [{ providerId: "Assets Studio" }],
    metadata: {
      creationTime: createdAt,
      lastSignInTime: "will be implemented",
    },
  };
          */}
    </>
  );
}

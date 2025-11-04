"use client";
import { useAuth } from "@/context/authContext";
import { useLoadingRouter } from "@/Components/LoadingRouterProvider";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/themeContext";
import {
  GetAssetsByUserId,
  GetAssets,
  GetAssetsByCategoria,
  GetByParam,
} from "@/utils/functions";
import AssetsCard from "@/Components/AssetsCard";
import ModalShowPicture from "./ModalShowPicture";
import ModalAssetData from "./ModalAssetData";
import { useSize } from "@/context/resizeContext";
import ModalDeleteAsset from "./ModalDeleteAsset";
import { useInterface } from "@/context/intercomunicationContext";
import SkeletonAnimationGrid from "@/skeletons/SkeletonAnimationGrid";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function LazyLoadPage({
  ByCurrentUser = false,
  category = false,
  param = "",
  freeAcces = false,
}) {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const { router } = useLoadingRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [ModalAssetsDataisOpen, setModalAssetsDataisOpen] = useState(false);
  const [ModalAssetDataReady, setModalAssetDataReady] = useState(false);
  const [hideAssets, setHideAssets] = useState(false);
  const { isMobile } = useSize();
  const ModalShowPictueRef = useRef();
  const ModalAssetOptionsRef = useRef();

  const loaderRef = useInfiniteScroll(LoadAssets, hasMore, { threshold: 0.1 });

  const { openModalAssetsDataWithAssetId, setOpenModalAssetsDataWithAssetId } =
    useInterface();

  // Reiniciar estado si cambian los parametros de busqueda
  useEffect(() => {
    setHasMore(true);
    setAssets([]);
    setPage(0);
    setIsLoading(true);
  }, [param]);

  // Revisar El contexto de interfaz por si hay un asset que abrir en el ModalAssetData
  useEffect(() => {
    if (!openModalAssetsDataWithAssetId || !ModalAssetDataReady) return;
    const { asset_id } = openModalAssetsDataWithAssetId;
    console.log("Asset_id:", asset_id);
    fetch(`api/assets/${asset_id}`)
      .then((res) => res.json())
      .then(({ asset, error }) => {
        console.log("estado:", asset, error);
        if (error) console.error("Error cargando el asset", error);

        if (asset) onClickBar(asset);

        setOpenModalAssetsDataWithAssetId(null);
      });
    // return () => setOpenModalAssetsDataWithAssetId(null);
  }, [openModalAssetsDataWithAssetId, ModalAssetDataReady]);

  // CApturar el momento exacto en el que El ModalAssetData se encuentra listo
  function setModalAssetOptionsRef(node) {
    ModalAssetOptionsRef.current = node;
    setModalAssetDataReady(true);
  }

  function verifyAcces() {
    if (user != "await" && user != null) return true;
    if (freeAcces) return true;
  }

  function onClickPhoto(asset) {
    if (ModalShowPictueRef.current) {
      ModalShowPictueRef.current.open(asset);
    }
  }
  function onClickBar(asset) {
    if (ModalAssetOptionsRef.current) {
      const modal = ModalAssetOptionsRef.current;
      setModalAssetsDataisOpen(true);
      if (isMobile) {
        setTimeout(() => {
          setHideAssets(true);
        }, 300);
      }
      modal.open(asset);
    }
  }

  function onClickComents(asset) {
    if (ModalAssetOptionsRef.current) {
      const modal = ModalAssetOptionsRef.current;
      setModalAssetsDataisOpen(true);
      if (isMobile) {
        setTimeout(() => {
          setHideAssets(true);
        }, 300);
      }
      modal.openAndCreateComent(asset);
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

  {
    /* Funcion para obtener los assets */
  }
  async function Get() {
    if (param != "") {
      console.log("Params from lazy:", param);
      const assets = await GetByParam(param, page, limit, freeAcces);
      return assets;
    }

    if (ByCurrentUser) {
      const userAssets = await GetAssetsByUserId(
        user?.uid,
        page,
        limit,
        freeAcces
      );
      return userAssets;
    }
    if (category) {
      const byCategoryAssets = await GetAssetsByCategoria(
        page,
        limit,
        category
      );
      return byCategoryAssets;
    }
    const assets = await GetAssets(page, limit, freeAcces);
    return assets;
  }

  {
    /* Funcion para cargar las dependencias */
  }

  async function LoadAssets() {
    setIsLoading(true);
    setError(false);
    const access = verifyAcces();
    if (user != "await") {
      if (access) {
        const data = await Get();
        console.log("Get all Assets", data);

        if (data) {
          const { session, error } = data;

          if (error) {
            setError(true);
            setIsLoading(false);
            return;
          }

          if (data.length < limit) setHasMore(false);

          setAssets((prev) => {
            const ids = new Set(prev.map((a) => a.id));
            const nuevos = data.filter((a) => !ids.has(a.id));
            return [...prev, ...nuevos];
          });

          setPage((prev) => prev + 1);

          if (session != null || session != undefined) {
            if (session == false) router("/login");
          }
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      router("/login");
    }
  }

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
      <ModalDeleteAsset />

      <div className="flex flex-row h-[100%] overflow-y-auto">
        <div
          className={`transition-all duration-300 min-w-0  ${
            ModalAssetsDataisOpen ? `w-full` : "w-0"
          } `}
        >
          <ModalAssetData
            ref={setModalAssetOptionsRef}
            onClose={() => {
              setHideAssets(false);
              setModalAssetsDataisOpen(false);
            }}
          />
        </div>

        <div
          className={`h-[100%] pb-40 overflow-auto min-w-0 ${
            hideAssets ? "hidden" : ""
          } ${
            ModalAssetsDataisOpen ? (isMobile ? "w-0" : "w-full") : "w-full"
          } `}
        >
          <div className="grid gap-6 p-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
            {assets?.map((asset) => (
              <AssetsCard
                key={asset.id}
                asset={asset}
                onClickBar={() => onClickBar(asset)}
                onClickPhoto={onClickPhoto}
                onClickComents={() => onClickComents(asset)}
              />
            ))}

            {/* Observer para cargar assets y manejo de error al cargar  */}

            {hasMore &&
              !error &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center ">
                  <div
                    className="w-full"
                    ref={(node) => {
                      if (i == 0) {
                        loaderRef(node);
                      }
                    }}
                  >
                    <SkeletonAnimationGrid cellCount={1} h={250} />
                  </div>
                </div>
              ))}
          </div>

          {/* Manejo de error del fetch  */}
          {error && (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
              <p
                className={`${currentTheme.colors.errorText} font-semibold text-lg`}
              >
                Could not connect to the database.
              </p>
              <button
                onClick={() => LoadAssets()}
                className={`px-4 py-2 rounded transition ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} ${currentTheme.textColor.primary}`}
              >
                Try Again
              </button>
            </div>
          )}
          {/* Mensaje cuando no hay mas assets  */}
          {!hasMore && (
            <div
              className={`py-6 text-center text-sm ${currentTheme.colors.mutedText}`}
            >
              No more items to load <strong>{assets.length} items</strong>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

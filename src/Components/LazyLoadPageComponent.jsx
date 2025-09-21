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
  const [hideAssets, setHideAssets] = useState(false);
  const { isMobile } = useSize();
  const loaderRef = useRef(null);
  const ModalShowPictueRef = useRef();
  const ModalAssetOptionsRef = useRef();

  function verifyAcces() {
    const access = false;
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

  const LoadAssets = useCallback(async () => {
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
  }, [hasMore, isLoading, page, limit, user, param]);

  useEffect(() => {
    setHasMore(true);
    setAssets([]);
    setPage(0);
    setIsLoading(true);
  }, [user, param]);

  useEffect(() => {
    if (page === 0 && hasMore && isLoading) {
      LoadAssets();
    }
  }, [page, hasMore, isLoading, LoadAssets]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          if (hasMore) LoadAssets();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isLoading, hasMore, LoadAssets]);

  async function Get() {
    if (param != "") {
      console.log("Params from lazy:", param);
      const assets = await GetByParam(param, page, limit, freeAcces);
      return assets;
    }

    if (ByCurrentUser) {
      const userAssets = await GetAssetsByUserId(
        user?.uid,
        user?.id,
        user.providerId,
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        <p className={`${currentTheme.colors.errorText} font-semibold text-lg`}>
          Could not connect to the database.
        </p>
        <button
          onClick={() => LoadAssets()}
          className={`px-4 py-2 rounded transition ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} ${currentTheme.textColor.primary}`}
        >
          Try Again
        </button>
      </div>
    );
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

      <div className="flex flex-row h-[100%] overflow-y-auto">
        <div
          className={`transition-all duration-300   ${
            ModalAssetsDataisOpen ? `w-full` : "w-0"
          } `}
        >
          <ModalAssetData
            ref={ModalAssetOptionsRef}
            onClose={() => {
              setHideAssets(false);
              setModalAssetsDataisOpen(false);
            }}
          />
        </div>

        <div
          className={`h-[100%] pb-40 overflow-auto ${
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
                currentUserId={user?.uid}
                onClickBar={() => onClickBar(asset)}
                onClickPhoto={onClickPhoto}
                onClickComents={() => onClickComents(asset)}
              />
            ))}
          </div>

          <div
            ref={loaderRef}
            className="h-16 flex flex-col items-center justify-center gap-2"
          >
            {isLoading && (
              <>
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
              </>
            )}
          </div>

          {!hasMore && (
            <div
              className={`py-6 text-center text-sm ${currentTheme.colors.mutedText}`}
            >
              No more items to load
            </div>
          )}
        </div>
      </div>
    </>
  );
}

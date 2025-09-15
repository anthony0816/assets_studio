"use client";
import { useAuth } from "@/context/authContext";
import { useLoadingRouter } from "@/Components/LoadingRouterProvider";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  GetAssetsByUserId,
  GetAssets,
  GetAssetsByCategoria,
  GetByParam,
} from "@/utils/functions";
import AssetsCard from "@/Components/AssetsCard";

export default function LazyLoadPage({
  ByCurrentUser = false,
  category = false,
  param = "",
  freeAcces = false,
}) {
  const { user } = useAuth();
  const { router } = useLoadingRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  console.log("assets", assets.length);

  function verifyAcces() {
    const access = false;
    if (user != "await" && user != null) return true;
    if (freeAcces) return true;
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
        <p className="text-red-600 font-semibold text-lg">
          Could not connect to the database.
        </p>
        <button
          onClick={() => LoadAssets()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {assets?.map((asset) => (
          <AssetsCard key={asset.id} asset={asset} user_id={user?.uid} />
        ))}
      </div>

      <div
        ref={loaderRef}
        className="h-16 flex flex-col items-center justify-center gap-2"
      >
        {isLoading && (
          <>
            {/* Spinner */}
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            {/* Texto */}
            <span className="text-sm text-gray-500 animate-pulse">
              Cargando más assets...
            </span>
          </>
        )}
      </div>

      {!hasMore && (
        <div className="py-6 text-center text-sm text-gray-400">
          No more items to load
        </div>
      )}
    </>
  );
}

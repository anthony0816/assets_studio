"use client";
import { useAuth } from "@/context/authContext";
import { useLoadingRouter } from "@/Components/LoadingRouterProvider";
import { useEffect, useState } from "react";
import { GetAssetsByUserId } from "@/utils/functions";

export default function MyAsets() {
  const { user } = useAuth();
  const { router } = useLoadingRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function execute() {
      await LoadAssets();
    }
    execute();
  }, [user]);

  async function LoadAssets() {
    setIsLoading(true);
    if (user != "await") {
      if (user) {
        const data = await GetAssetsByUserId(
          user?.uid,
          user?.id,
          user.providerId
        );
        console.log("Get all Assets", data);
        if (data) setAssets(data);

        setIsLoading(false);
      }
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <div className="relative">
          {/* Círculo base */}
          <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
          {/* Spinner animado */}
          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-t-transparent border-b-blue-500 animate-spin"></div>
        </div>
        <span className="text-sm text-gray-500 animate-pulse">
          Cargando assets...
        </span>
      </div>
    );
  }
  if (assets.length === 0) {
    console.error("Database connection error");
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {assets?.map((asset) => (
        <div
          key={asset.id}
          className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
        >
          <img
            src={asset.src}
            alt={`Asset ${asset.id}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-3 flex flex-col gap-1">
            <span className="text-sm text-gray-600">
              Likes: {asset.likes} | Reports: {asset.reports}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(asset.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

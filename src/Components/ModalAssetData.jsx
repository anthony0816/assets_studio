"use client";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { useLoadingRouter } from "./LoadingRouterProvider";
import { useData } from "@/context/GlobalDataAccesContext";

const ModalAssetData = forwardRef((props, ref) => {
  const { router } = useLoadingRouter();
  const storage = useData();
  const [asset, setAsset] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { onClose } = props;
  const { currentTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [fetchingUserError, setfetchingUserError] = useState(false);

  useImperativeHandle(ref, () => ({
    open: (asset) => {
      setAsset(asset);
      setUser(null);
      setIsOpen(true);
    },
  }));

  function close() {
    setAsset(null);
    setUser(null);
    setIsOpen(false);
    onClose();
  }

  useEffect(() => {
    if (!asset) return;

    loadDataFromUser();
  }, [asset]);

  async function loadDataFromUser() {
    const res = await GetDataFromUser();
    if (!res.ok) {
      console.error("Error a la hora de hacer el fetch", res);
      setfetchingUserError(true);
      return;
    }
    const data = await res.json();
    console.log("Data", data);
    setUser(data);
  }

  async function GetDataFromUser() {
    setfetchingUserError(false);
    const res = await fetch("api/user/get", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify({
        uid: asset.user_id,
      }),
    });
    return res;
  }

  function GoToUserProfile(user) {
    storage.setUserToProfile(user);
    router("/visit_user_profile");
  }

  if (!isOpen) return;
  return (
    <>
      <div
        className={`h-full w-full  overflow-y-auto rounded-xl shadow-lg ${currentTheme.colors.secondary} ${currentTheme.textColor.primary}`}
      >
        {/* Imagen principal */}
        <div className="w-full h-64 overflow-hidden rounded-t-xl">
          <img
            src={asset.src}
            alt={`Asset ${asset.id}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Información del asset */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${currentTheme.textColor.secondary}`}>
              {new Date(asset.createdAt).toLocaleDateString()}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${currentTheme.colors.third} ${currentTheme.textColor.secondary}`}
            >
              {asset.categoria}
            </span>
          </div>

          <span
            onClick={() => GoToUserProfile(user)}
            className={`hover:text-blue-500 transition  cursor-pointer`}
          >
            {user?.displayName || (
              <span onClick={(e) => e.stopPropagation()}>
                {fetchingUserError ? (
                  <span
                    onClick={loadDataFromUser}
                    className="text-red-400 cursor-pointer hover:text-red-500"
                  >
                    error, try again🔄
                  </span>
                ) : (
                  "loadind..."
                )}
              </span>
            )}
          </span>

          {/* Likes y Reports */}
          <div className="flex gap-4 text-sm">
            <span className={currentTheme.textColor.muted}>
              ❤️ {asset.likes?.length || 0}
            </span>
            <span className={currentTheme.textColor.muted}>
              🚩 {asset.reports?.length || 0}
            </span>
          </div>
        </div>

        {/* Botón cerrar */}
        <div
          onClick={close}
          className={` sticky top-0 cursor-pointer text-center py-3 mt-2 ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} rounded-b-xl`}
        >
          Cerrar
        </div>
      </div>
    </>
  );
});

ModalAssetData.displayName = "ModalAssetData";
export default ModalAssetData;

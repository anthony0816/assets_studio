import { useTheme } from "@/context/themeContext";
import NotificationsStatesIcon from "@/Icons/NotificationsStatesIcon";
import { GiveFormatToNotification } from "@/utils/notifications";
import { useEffect, useState } from "react";
import Image from "next/image";
import LoadingSpinner from "./LoadingSpiner";
import { formatDate } from "@/utils/date";
import { useInterface } from "@/context/intercomunicationContext";
import { useLoadingRouter } from "./LoadingRouterProvider";

export default function NotificationCard({ notificacion, onRedirect }) {
  const { currentTheme } = useTheme();
  const [avatar, setAvatar] = useState("/vercel.svg");
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const [imageError, setImageError] = useState(false);

  /* const [openModalAssetsDataWithAssetId,setOpenModalAssetsDataWithAssetId ] = useState(null) */
  const { setOpenModalAssetsDataWithAssetId } = useInterface();

  const { router } = useLoadingRouter();

  notificacion = GiveFormatToNotification(notificacion);

  // Cargar el avatar del usuario
  useEffect(() => {
    setLoadingAvatar(true);
    fetch(
      `api/notifications/get-user-avatar-on-uid/${notificacion.user_who_acts}`
    )
      .then((res) => res.json())
      .then(({ avatar, error, from_cache }) => {
        if (from_cache) alert("From cache");
        if (avatar) setAvatar(avatar);
        if (error) console.error("Error Cargando el Avatar", error);
        setLoadingAvatar(false);
      });
  }, []);

  function handleRedirrection() {
    const url = notificacion.redirectionUrl;
    const asset_id = notificacion.assetTarget;
    setOpenModalAssetsDataWithAssetId({ asset_id: asset_id });
    onRedirect();
    router(url);
  }

  if (notificacion)
    return (
      <div
        onClick={handleRedirrection}
        className={`
        relative p-4 rounded-xl border-l-4 transition-all duration-300 
        hover:shadow-lg transform hover:-translate-y-0.5
        ${currentTheme.colors.border} ${currentTheme.colors.secondary}
        group cursor-pointer 
      `}
        style={{
          borderLeftColor: currentTheme.colors.primary || "#3B82F6",
          background: `linear-gradient(135deg, ${currentTheme.colors.secondary} 0%, ${currentTheme.colors.primary}15 100%)`,
        }}
      >
        {/* Avatar */}
        <div className="flex items-center gap-3">
          {/* Indicador de estado */}
          {!notificacion.read && (
            <div
              className="  w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: "#0defebff" }}
            />
          )}

          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1"
            style={{
              backgroundColor: `${currentTheme.colors.primary}20`,
              color: currentTheme.colors.primary,
            }}
          >
            <div className=" flex items-center justify-center w-30 h-10 relative rounded-xl overflow-hidden bg-black">
              {loadingAvatar ? (
                <LoadingSpinner color="white" />
              ) : (
                <>
                  {!imageError ? (
                    <Image
                      src={avatar}
                      alt="Profile Photo"
                      fill
                      sizes="24px"
                      priority
                      className={
                        avatar == "vercel.svg"
                          ? "object-contain"
                          : "object-cover"
                      }
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <>
                      {/* Manegar el error de la tag Image de next */}
                      <img
                        src={avatar}
                        alt="Profile Photo"
                        className="object-cover"
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Mensaje - ahora usando content */}
            <div
              className={`font-medium leading-6 ${currentTheme.textColor.primary} group-hover:underline`}
            >
              {notificacion.content || notificacion.message}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`text-xs ${currentTheme.textColor.muted} flex items-center gap-1`}
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatDate(notificacion.createdAt)}
              </div>

              {notificacion.type && (
                <span
                  className="px-2 py-1 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: `${currentTheme.colors.primary}20`,
                    color: currentTheme.colors.primary,
                  }}
                >
                  <NotificationsStatesIcon type={notificacion.type} />
                </span>
              )}
            </div>
          </div>

          {/* Botón de acción */}
          <button
            className="transition-opacity duration-200 p-1 rounded-full hover:bg-black hover:bg-opacity-10"
            style={{ color: currentTheme.colors.primary }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
}

import { FiUser, FiLoader } from "react-icons/fi";
import { useAuth } from "@/context/authContext";
import { useState, useRef } from "react";
import { useTheme } from "@/context/themeContext";
import { useLoadingRouter } from "./LoadingRouterProvider";
import { useClickOutside } from "@/utils/hooks";

export default function UserCard({ isOpen, OpenNavFunction = null }) {
  const { user, loading, logout } = useAuth();
  const { currentTheme } = useTheme();

  // Estado de carga para la imagen
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const userCardRef = useRef(null);
  const { router } = useLoadingRouter();

  useClickOutside(userCardRef, () => setIsExpanded(false));

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  // Mostrar indicador de carga si los datos aún se están cargando
  if (loading) {
    return (
      <div
        className={`p-2 rounded ${currentTheme.colors.hover} transition flex space-x-2 cursor-pointer`}
      >
        <FiLoader size={24} className="animate-spin" />
        {isOpen && <div className="whitespace-nowrap">Cargando...</div>}
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <div
          onClick={() => router("/login")}
          className={`p-2 rounded ${
            currentTheme.colors.hover
          } transition flex space-x-2 cursor-pointer ${
            !isOpen && "justify-center"
          }`}
        >
          <FiUser size={24} />
          {isOpen && <div className="whitespace-nowrap">Sign up</div>}
        </div>
      ) : (
        <div ref={userCardRef} className="relative">
          <div
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (OpenNavFunction) OpenNavFunction();
            }}
            className={`p-2 rounded ${currentTheme.colors.hover} transition flex space-x-2 cursor-pointer`}
          >
            <div className="relative">
              {user.avatar && !imageError ? (
                <>
                  {!imageLoaded && (
                    <div
                      className={`w-6 h-6 rounded-full ${currentTheme.colors.fourth} animate-pulse`}
                    ></div>
                  )}
                  <img
                    src={user.avatar}
                    alt={user.name || "User avatar"}
                    className={`w-6 h-6 rounded-full object-cover ${
                      !imageLoaded ? "hidden" : ""
                    }`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </>
              ) : (
                <div
                  className={`w-6 h-6 rounded-full ${currentTheme.colors.buttonPrimary} flex items-center justify-center`}
                >
                  <FiUser size={14} className="text-white" />
                </div>
              )}
            </div>
            {isOpen && (
              <div className="whitespace-nowrap">{user.name || "Usuario"}</div>
            )}
          </div>

          {/* Menú desplegable */}
          <div
            className={`absolute overflow-hidden ${
              currentTheme.colors.secondary
            } rounded-xl p-2 mx-auto w-full flex flex-col space-y-2 justify-center transition ${
              !isOpen
                ? "opacity-0"
                : isExpanded
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <button className="whitespace-nowrap px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200">
              Perfil
            </button>
            <button
              onClick={logout}
              className={`whitespace-nowrap px-4 py-2 rounded-lg ${currentTheme.colors.buttonGoogle} text-white font-medium shadow-md ${currentTheme.colors.buttonGoogleHover} hover:shadow-lg hover:scale-105 transition-transform duration-200`}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}

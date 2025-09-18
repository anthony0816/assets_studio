"use client";
import { useData } from "@/context/GlobalDataAccesContext";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import LazyLoadPage from "@/Components/LazyLoadPageComponent";

export default function UserProfile() {
  const storage = useData();
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const user = storage.userToProfile;
    setUser(user);
  }, [storage.userToProfile]);

  if (!user) return null;

  return (
    <>
      <div
        className={`${currentTheme.colors.primary} min-h-screen p-6 h-[100%] overflow-auto`}
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
              className={`${currentTheme.textColor.primary} text-xl font-semibold mb-4`}
            >
              Información de la cuenta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`${currentTheme.colors.secondary} p-4 rounded-lg`}
              >
                <p className={`${currentTheme.textColor.muted} text-sm`}>
                  Provider
                </p>
                <p className={`${currentTheme.textColor.secondary}`}>
                  {user.providerData[0]?.providerId || "Google"}
                </p>
              </div>

              <div
                className={`${currentTheme.colors.secondary} p-4 rounded-lg`}
              >
                <p className={`${currentTheme.textColor.muted} text-sm`}>
                  Created at
                </p>
                <p className={`${currentTheme.textColor.secondary}`}>
                  {user.metadata.creationTime}
                </p>
              </div>

              <div
                className={`${currentTheme.colors.secondary} p-4 rounded-lg`}
              >
                <p className={`${currentTheme.textColor.muted} text-sm`}>
                  Last seen
                </p>
                <p className={`${currentTheme.textColor.secondary}`}>
                  {user.metadata.lastSignInTime}
                </p>
              </div>
            </div>
          </div>

          <h2
            className={`${currentTheme.textColor.primary} text-xl font-semibold mb-4`}
          >
            Assets
          </h2>
          <div className="h-[100%]"></div>
          <LazyLoadPage freeAcces={true}></LazyLoadPage>
        </div>
      </div>
    </>
  );
}

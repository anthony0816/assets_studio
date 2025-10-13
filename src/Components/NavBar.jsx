"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { useLoadingRouter } from "./LoadingRouterProvider";
import { useSize } from "@/context/resizeContext";
import UserCard from "./userCard";
import { useTheme } from "@/context/themeContext";
import LogoAssetsStudio from "./LogoAssetsStudio";
import MobileNavBar from "./MobileNavBar";
import SettingsMenu from "./SettingsMenu";
import NotificationsModule from "./NotificationsModule";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(true);
  const { router } = useLoadingRouter();
  const [mobileStyle, setMobileStyle] = useState(true);
  const { isMobile } = useSize();
  const { currentTheme, setIsBlackTheme, isBlackTheme } = useTheme();

  useEffect(() => {
    console.log("Estadi de si es mobile", isMobile);
    setMobileStyle(isMobile);
  }, [isMobile]);

  useEffect(() => {
    setIsBlackTheme(localStorage.getItem("isDark"));
  }, []);

  const items = [
    { name: "Discover Assets", route: "/allAssets", fl: "DA" },
    { name: "Create with IA", route: "/IA-Creator", fl: "CR" },
    { name: "Upload Asset", route: "/upload-asset", fl: "UP" },
    { name: "My Assets", route: "/my-assets", fl: "MA" },
  ];

  if (!currentTheme) return;
  return (
    <>
      <aside
        className={
          mobileStyle
            ? `hidden`
            : `h-[100vh] ${currentTheme.colors.primary} ${
                currentTheme.textColor.primary
              } shadow-lg transition-all duration-300 z-50 overflow-y-auto overflow-x-hidden
         ${isOpen ? "w-64" : "w-16"} 
         relative border ${currentTheme.colors.border}`
        }
      >
        <div
          className={`flex flex-${
            isOpen ? "row" : "col"
          } items-center justify-between mt-5`}
        >
          {/* Modulo de Notificaciones  */}
          <NotificationsModule />
          {/* Botón de expansión */}

          <div
            className={`flex justify-end p-4 sticky top-0 ${currentTheme.colors.primary}`}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none ${currentTheme.colors.hover} p-2 rounded transition`}
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* LOGO */}
        <LogoAssetsStudio isOpen={isOpen} onClick={() => router("/")} />

        {/* Menú para escritorio */}
        {!mobileStyle && (
          <nav className="mt-4">
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  onClick={() => router(item.route)}
                  className={`${currentTheme.colors.secondary} w-[90%] mx-auto whitespace-nowrap px-4 py-2 ${currentTheme.colors.hover} rounded-xl cursor-pointer`}
                >
                  {isOpen ? item.name : item.fl}
                </div>
              ))}

              <div className="mt-10">
                <SettingsMenu
                  isOpen={isOpen}
                  OpenNavFunction={() => setIsOpen(true)}
                />
                <UserCard
                  isOpen={isOpen}
                  OpenNavFunction={() => {
                    setIsOpen(true);
                  }}
                />
              </div>
            </div>
          </nav>
        )}
      </aside>

      {/* Menu para Mobiles */}
      {mobileStyle && <MobileNavBar items={items} router={router} />}
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { useLoadingRouter } from "./LoadingRouterProvider";
import { useSize } from "@/context/resizeContext";
import UserCard from "./userCard";
import { useTheme } from "@/context/themeContext";
import LogoAssetsStudio from "./LogoAssetsStudio";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(true);
  const { router } = useLoadingRouter();
  const [mobileStyle, setMobileStyle] = useState(true);
  const { isMobile } = useSize();
  const { currentTheme } = useTheme();

  useEffect(() => {
    console.log("Estadi de si es mobile", isMobile);
    setMobileStyle(isMobile);
  }, [isMobile]);

  const items = [
    { name: "Create with IA", route: "/ia", fl: "c" },
    { name: "Create with IA", route: "/ia", fl: "c" },
    { name: "Create with IA", route: "/ia", fl: "c" },
    { name: "Create with IA", route: "/ia", fl: "c" },
    { name: "Create with IA", route: "/ia", fl: "c" },
    { name: "Create with IA", route: "/ia", fl: "c" },
    { name: "Create with IA", route: "/ia", fl: "c" },
    { name: "Create with IA", route: "/ia", fl: "c" },
  ];

  if (!currentTheme) return;
  return (
    <aside
      className={
        mobileStyle
          ? `fixed bottom-0 left-0 w-full  ${currentTheme.colors.primary} flex flex-row overflow-x-auto`
          : `h-[100vh] ${
              currentTheme.colors.primary
            } text-white shadow-lg transition-all duration-300 z-50  overflow-y-auto overflow-x-hidden
    ${isOpen ? "w-64" : "w-16"} 
    relative`
      }
    >
      {/* Botón de expansión */}
      {!mobileStyle && (
        <div
          className={`flex justify-end p-4 sticky top-0 ${currentTheme.colors.primary}`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none hover:bg-gray-800 p-2 rounded transition"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      )}
      {/*LOGO*/}
      <LogoAssetsStudio isOpen={isOpen} onClick={() => router("/")} />

      {/* Menú */}
      <nav className={mobileStyle ? "mt-0 w-full" : "mt-4"}>
        <div
          className={
            mobileStyle
              ? "w-full flex  items-center gap-2 py-2 " // mobile: centrado horizontal/vertical
              : "flex flex-col gap-2" // desktop: columna con gap vertical
          }
        >
          {items.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`} // clave única
              onClick={() => router(item.route)}
              className={`${
                mobileStyle
                  ? `whitespace-nowrap bg-blue-300 text-center flex-shrink-0`
                  : ""
              } whitespace-nowrap px-4 py-2 hover:bg-gray-800 rounded cursor-pointer`}
            >
              {mobileStyle ? item.name : isOpen ? item.name : item.fl}
            </div>
          ))}

          {!mobileStyle && <UserCard isOpen={isOpen} />}
        </div>
      </nav>
    </aside>
  );
}

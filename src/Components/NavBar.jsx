"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { useLoadingRouter } from "./LoadingRouterProvider";
import { useSize } from "@/context/resizeContext";
import UserCard from "./userCard";
import { useTheme } from "@/context/themeContext";
import LogoAssetsStudio from "./LogoAssetsStudio";
import MobileNavBar from "./MobileNavBar";

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

  const items = [{ name: "Create with IA", route: "/ia", fl: "c" }];

  if (!currentTheme) return;
  return (
    <>
      <aside
        className={
          mobileStyle
            ? `hidden`
            : `h-[100vh] ${
                currentTheme.colors.primary
              } text-white shadow-lg transition-all duration-300 z-50  overflow-y-auto overflow-x-hidden
    ${isOpen ? "w-64" : "w-16"} 
    relative`
        }
      >
        {/* Botón de expansión */}
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

        {/*LOGO*/}
        <LogoAssetsStudio isOpen={isOpen} onClick={() => router("/")} />

        {/* Menú para escritorio*/}
        {!mobileStyle && (
          <nav className={"mt-4"}>
            <div className={"flex flex-col gap-2"}>
              {items.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`} // clave única
                  onClick={() => router(item.route)}
                  className={` whitespace-nowrap px-4 py-2 hover:bg-gray-800 rounded cursor-pointer`}
                >
                  {isOpen ? item.name : item.fl}
                </div>
              ))}

              {
                <UserCard
                  isOpen={isOpen}
                  OpenNavFunction={() => {
                    setIsOpen(true);
                  }}
                />
              }
            </div>
          </nav>
        )}
      </aside>
      {/* Menu para Mobiles */}
      {mobileStyle && <MobileNavBar items={items} router={router} />}
    </>
  );
}

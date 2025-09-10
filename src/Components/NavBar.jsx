"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { useLoadingRouter } from "./LoadingRouterProvider";
import { useSize } from "@/context/resizeContext";
import UserCard from "./userCard";
import { useTheme } from "@/context/themeContext";

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

  const items = [{ name: "Create with IA", route: "ia", fl: "c" }];
  if (!currentTheme) return;
  return (
    <aside
      className={
        mobileStyle
          ? `fixed bottom-0 left-0 w-full  ${currentTheme.colors.primary} flex flex-row overflow-x-auto`
          : `h-[100vh] ${
              currentTheme.colors.primary
            } text-white shadow-lg transition-all duration-300 z-50 
    ${isOpen ? "w-64" : "w-16"} 
    relative`
      }
    >
      {/* Botón de expansión */}
      {!mobileStyle && (
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none hover:bg-gray-800 p-2 rounded transition"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      )}

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
              className={`${
                mobileStyle
                  ? `whitespace-nowrap bg-blue-300 text-center flex-shrink-0`
                  : ""
              } px-4 py-2 hover:bg-gray-800 rounded cursor-pointer`}
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

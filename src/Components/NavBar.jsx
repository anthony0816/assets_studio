"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useSize } from "@/utils/resizeContext";
import UserCard from "./userCard";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileStyle, setMobileStyle] = useState(true);
  const { isMobile } = useSize();

  useEffect(() => {
    console.log("Estadi de si es mobile", isMobile);
    setMobileStyle(isMobile);
  }, [isMobile]);

  const items = [
    { name: "Aswegrwsets", fl: "A" },
    { name: "Create Asset", fl: "C" },
    { name: "dreate Asset", fl: "C" },
    { name: "vr", fl: "C" },
    { name: "vvreate Asset", fl: "C" },
    { name: "sdvreate Asset", fl: "C" },
  ];

  return (
    <aside
      className={
        mobileStyle
          ? "fixed bottom-0 left-0 w-full  bg-red-200 flex flex-row overflow-x-auto"
          : `h-[100vh] bg-gray-900 text-white shadow-lg transition-all duration-300 z-50 
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
                  ? "whitespace-nowrap bg-blue-300 text-center flex-shrink-0"
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

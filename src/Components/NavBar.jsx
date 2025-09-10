"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useSize } from "@/utils/resizeContext";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileStyle, setMobileStyle] = useState(true);
  const { isMobile } = useSize();

  useEffect(() => {
    console.log("Estadi de si es mobile", isMobile);
    setMobileStyle(isMobile);
  }, [isMobile]);

  return (
    <aside
      className={
        mobileStyle
          ? "fixed bottom-0 left-0 w-full  bg-red-200 flex flex-row"
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
      <nav className={`mt-4`}>
        <div className={`space-y-2 ${mobileStyle && "flex flex-row"}`}>
          <div className="px-4 py-2 hover:bg-gray-800 rounded cursor-pointer">
            {isOpen ? "Assets" : "A"}
          </div>
          <div className="px-4 py-2 hover:bg-gray-800 rounded cursor-pointer">
            {isOpen ? "Create Assets" : "C"}
          </div>
        </div>
      </nav>
    </aside>
  );
}

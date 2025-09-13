"use client";
import { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import LogoAS from "./LogoAS";
import { useSize } from "@/context/resizeContext";
import { useClickOutside } from "@/utils/hooks";
import { useRef } from "react";
import UserCard from "./userCard";
import { useTheme } from "@/context/themeContext";

export default function MobileNavBar({ items, router }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useSize(null);
  const headerRef = useRef(null);
  const { currentTheme } = useTheme();

  useClickOutside(headerRef, () => setIsOpen(false));

  return (
    <header
      ref={headerRef}
      className="w-full bg-gray-900 text-white shadow-md fixed top-0 left-0 z-50"
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="">
          <LogoAS height={49} width={49} onClick={() => router("/")} />
        </div>

        {/* Botón menú */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded hover:bg-gray-800 transition"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Usuario sin Autenticar */}
        <UserCard isOpen={true} />
      </div>

      {/* Menú desplegable */}
      <nav
        className={`flex flex-col ${isOpen ? "pb-5" : ""} space-y-2 ${
          currentTheme.colors.primary
        } overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {items.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            onClick={() => {
              router(item.route);
              setIsOpen(false); // cerrar menú al navegar
            }}
            className={` ${currentTheme.colors.third} w-[90%] mx-auto rounded-xl px-4 py-3 hover:bg-gray-700 cursor-pointer whitespace-nowrap`}
          >
            {item.name}
          </div>
        ))}
      </nav>
    </header>
  );
}

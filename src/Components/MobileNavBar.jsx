"use client";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import LogoAS from "./LogoAS";
import { useClickOutside } from "@/utils/hooks";
import { useRef } from "react";
import UserCard from "./userCard";
import { useTheme } from "@/context/themeContext";
import SettingsMenu from "./SettingsMenu";
import { NotificationIcon } from "@/Icons/NotificationIcon";

export default function MobileNavBar({ items, router }) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);
  const { currentTheme } = useTheme();

  useClickOutside(headerRef, () => setIsOpen(false));

  return (
    <header
      ref={headerRef}
      className={`w-full ${currentTheme.colors.primary} ${currentTheme.textColor.primary} shadow-md  `}
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div>
          <LogoAS height={49} width={49} onClick={() => router("/")} />
        </div>

        {/* Opciones simepre visibles  */}
        <div className="w-full flex justify-end space-x-2 px-4">
          {/* Icono de busqueda */}
          <div
            className={`  flex items-center ${currentTheme.colors.hover} p-2 transition rounded`}
          >
            <NotificationIcon />
          </div>

          {/* Usuario sin Autenticar */}
          <UserCard isOpen={true} />
        </div>

        {/* Botón menú */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded ${currentTheme.colors.hover} transition`}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
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
            className={`${currentTheme.colors.third} w-[90%] mx-auto rounded-xl px-4 py-3 ${currentTheme.colors.hover} cursor-pointer whitespace-nowrap`}
          >
            {item.name}
          </div>
        ))}
        <div className="flex justify-end">
          <div className="w-30 rounded-xl">
            <SettingsMenu
              iconHeigth="30"
              iconWidth="30"
              menuIconHeigth="30"
              menuIconWidth="30"
              marginBetween="4"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

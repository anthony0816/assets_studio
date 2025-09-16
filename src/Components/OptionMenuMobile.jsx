"use client";
import { useState } from "react";
import CategorySelector from "./CategorySelector";
import { useTheme } from "@/context/themeContext";

export default function OptionMenuMobile({
  items,
  show,
  colorContext,
  itemsOnClick,
}) {
  const { color, tcolor } = colorContext;
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentTheme } = useTheme();

  if (show)
    return (
      <>
        <ul className="flex flex-col flex-wrap justify-center space-y-2 space-x-3 px-4 pt-3 mt-4">
          {/* Opciones */}
          <div
            className={`grid grid-cols-2 gap-4 overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-400" : "max-h-[0px]"
            }`}
          >
            {items.map((item) => (
              <li
                onClick={() => itemsOnClick(item.clave)}
                key={item.clave}
                className={`whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary} ${currentTheme.colors.hover}`}
              >
                {item.name}
              </li>
            ))}
          </div>

          {/* barra con botón de expansión */}
          <div
            className={`flex flex-row justify-between ${
              isExpanded ? "mt-5" : "mt-0"
            } transition-all duration-300`}
          >
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary} ${currentTheme.colors.hover}`}
              >
                {isExpanded ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M6.225 4.811 4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M4 10V4h6V2H2v8h2zm6 10H4v-6H2v8h8v-2zm10-10h-6V2h-2v8h8v-2zm-6 10v-6h6v-2h-8v8h2z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex flex-row ml-5 items-center whitespace-nowrap">
              <p className={`${tcolor.primary} mr-4`}>Categorias: </p>
              <select
                onChange={(e) => itemsOnClick(e.target.value)}
                className={`whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary} ${currentTheme.colors.hover}`}
              >
                <option value="">Select</option>
                <CategorySelector />
              </select>
            </div>
          </div>
        </ul>
      </>
    );
}

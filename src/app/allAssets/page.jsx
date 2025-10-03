"use client";
import LazyLoadPage from "@/Components/LazyLoadPageComponent";
import CategorySelector from "@/Components/CategorySelector";
import { useTheme } from "@/context/themeContext";
import { useSize } from "@/context/resizeContext";
import OptionMenuMobile from "@/Components/OptionMenuMobile";
import { useState } from "react";
import { SearchIcon } from "@/Icons/SearchIcon";
import InputSearch from "@/Components/InputSearch";

export default function AssetsPage() {
  const { currentTheme } = useTheme();
  const { isMobile } = useSize();
  const color = currentTheme.colors;
  const tcolor = currentTheme.textColor;
  const colorContext = { color, tcolor };

  const [param, setParam] = useState("");
  const [searching, setSearching] = useState(true);

  const items = [
    { name: "Explore Assets", clave: "explore" },
    { name: "More Liked", clave: "moreliked" },
    { name: "Less Liked", clave: "lessliked" },
    { name: "Lastest", clave: "lastest" },
  ];

  const handleItemsClick = async (clave) => {
    setParam(clave);
  };

  return (
    <>
      <div className="overflow-hidden h-[100vh]">
        <section
          className={` py-2  w-[100%] shadow text-center ${color.secondary} rounded `}
        >
          {!isMobile && (
            <>
              {/* Lista con solo el search */}
              <ul
                className={` transition-all duration-300 ${
                  searching
                    ? "max-h-999 opacity-100 "
                    : "max-h-0 opacity-0 pointer-events-none"
                } flex flex-row flex-wrap justify-center items-center gap-3 px-4`}
              >
                <li className="w-full max-w-200">
                  <InputSearch onClose={() => setSearching(!searching)} />
                </li>
              </ul>

              {/* Lista de elementos  */}
              <ul
                className={` transition-all duration-300 ${
                  searching
                    ? "max-h-0 opacity-0 pointer-events-none"
                    : "max-h-999 opacity-100 "
                } flex flex-row flex-wrap justify-center items-center gap-3 px-4`}
              >
                {items.map((item) => (
                  <li
                    onClick={() => handleItemsClick(item.clave)}
                    key={item.clave}
                    className={` whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary}`}
                  >
                    {item.name}
                  </li>
                ))}
                <li>
                  <select
                    onChange={(e) => handleItemsClick(e.target.value)}
                    className={`  whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary}`}
                  >
                    <option value="">Select a category</option>
                    <CategorySelector />
                  </select>
                </li>
                <li
                  onClick={() => setSearching(!searching)}
                  className={` whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary}`}
                >
                  <SearchIcon color={color.SearchIcon} />
                </li>
              </ul>
            </>
          )}

          {/* Menu de opciones para mobiles */}
          <OptionMenuMobile
            items={items}
            show={isMobile}
            colorContext={colorContext}
            itemsOnClick={handleItemsClick}
          />
        </section>
        <div className={`  h-[100%]`}>
          <LazyLoadPage param={param} freeAcces={true} />
        </div>
      </div>
    </>
  );
}

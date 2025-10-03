"use client";
import LazyLoadPage from "@/Components/LazyLoadPageComponent";

import { useTheme } from "@/context/themeContext";
import { useSize } from "@/context/resizeContext";
import OptionMenuMobile from "@/Components/OptionMenuMobile";
import OptionMenuDesktop from "@/Components/OptionMenuDesktop";
import { useState } from "react";
import { SearchIcon } from "@/Icons/SearchIcon";

export default function AssetsPage() {
  const { currentTheme } = useTheme();
  const { isMobile } = useSize();
  const color = currentTheme.colors;
  const tcolor = currentTheme.textColor;
  const colorContext = { color, tcolor };

  const [param, setParam] = useState("");

  const items = [
    { name: "Explore Assets", clave: "explore" },
    { name: "More Liked", clave: "moreliked" },
    { name: "Less Liked", clave: "lessliked" },
    { name: "Lastest", clave: "lastest" },
  ];

  const handleItemsClick = async (clave) => {
    setParam(clave);
  };

  function handlesearch(query) {
    console.log("query:", query);
  }

  return (
    <>
      <div className="overflow-hidden h-[100vh]">
        <section
          className={` py-2  w-[100%] shadow text-center ${color.secondary} rounded `}
        >
          <OptionMenuDesktop
            items={items}
            show={!isMobile}
            colorContext={colorContext}
            itemsOnClick={handleItemsClick}
            onSearch={handlesearch}
          />

          {/* Menu de opciones para mobiles */}
          <OptionMenuMobile
            items={items}
            show={isMobile}
            colorContext={colorContext}
            itemsOnClick={handleItemsClick}
            onSearch={handlesearch}
          />
        </section>
        <div className={`  h-[100%]`}>
          <LazyLoadPage param={param} freeAcces={true} />
        </div>
      </div>
    </>
  );
}

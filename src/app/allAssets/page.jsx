"use client";
import LazyLoadPage from "@/Components/LazyLoadPageComponent";
import { useTheme } from "@/context/themeContext";
import { useSize } from "@/context/resizeContext";
import OptionMenuMobile from "@/Components/OptionMenuMobile";

export default function AssetsPage() {
  const { currentTheme } = useTheme();
  const { isMobile } = useSize();
  const color = currentTheme.colors;
  const tcolor = currentTheme.textColor;
  const colorContext = { color, tcolor };

  const items = [
    "Explore Assets",
    "Monst Wanted",
    "examvsple",
    "examvple",
    "example",

    "exampsdvle",
  ];
  return (
    <>
      <section
        className={` sticky top-0  w-[100%] shadow text-center   ${color.secondary} pb-4`}
      >
        {!isMobile && (
          <h1
            className={` whitespace-nowrap text-center text-xl  ${tcolor.primary}`}
          >
            Find here what you need
          </h1>
        )}
        {!isMobile && (
          <ul className="flex flex-row flex-wrap justify-center space-y-2 space-x-3 px-4 mt-4">
            {items.map((item) => (
              <li
                key={item}
                className={` whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary}`}
              >
                {item}
              </li>
            ))}
            <li>
              <div className="flex flexd-row ml-5  whitespace-nowrap">
                <p className={`${tcolor.primary} mr-4 `}>Categorias: </p>
                <select
                  className={`  whitespace-nowrap rounded-xl cursor-pointer p-1 px-3 font-bold ${color.primary} ${tcolor.secondary}`}
                >
                  <option value="">Select</option>
                  <option value="objetos">Objetos</option>
                  <option value="presonajes">Personajes</option>
                  <option value="naturaleza">Naturaleza</option>
                </select>
              </div>
            </li>
          </ul>
        )}

        {/* Menu de opciones para mobiles */}
        <OptionMenuMobile
          items={items}
          show={isMobile}
          colorContext={colorContext}
        />
      </section>
      <div className={`pt-30`}>
        <LazyLoadPage />
      </div>
    </>
  );
}

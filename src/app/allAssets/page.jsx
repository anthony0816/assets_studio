"use client";
import LazyLoadPage from "@/Components/LazyLoadPageComponent";
import { useTheme } from "@/context/themeContext";
import { useSize } from "@/context/resizeContext";

export default function AssetsPage() {
  const items = ["Explore Assets", "Monst Wanted"];
  const { currentTheme } = useTheme();
  const { isMobile } = useSize();
  const color = currentTheme.colors;
  const tcolor = currentTheme.textColor;

  return (
    <>
      <section
        className={` fixed top-${
          isMobile ? "40" : "0"
        }  w-full shadow text-center   ${color.secondary} pb-4`}
      >
        <h1
          className={` whitespace-nowrap text-center text-xl  ${tcolor.primary}`}
        >
          Find here what you need
        </h1>
        <ul className="flex flex-row  space-x-3 px-4 mt-4">
          {items.map((item) => (
            <li
              key={item}
              className={` whitespace-nowrap rounded-xl cursor-pointer p-1 font-bold ${color.primary} ${tcolor.secondary}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
      <div className={`pt-30`}>
        <LazyLoadPage />
      </div>
    </>
  );
}

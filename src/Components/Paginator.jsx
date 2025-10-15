import { useTheme } from "@/context/themeContext";
import { useState } from "react";

export default function Paginator({
  onNext,
  onPrev,
  onFirst,
  onLast,
  page,
  onClikPage,
}) {
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  let prevPage = page;
  let nextPage = page;
  return (
    <>
      <div
        className={`${tcolor.primary} ${color.secondary}  space-x-4  p-2 flex flex-wrap items-center justify-center  mx-auto rounded `}
      >
        <div
          className={`${color.primary} p-3 rounded-xl cursor-pointer`}
          onClick={() => onFirst()}
        >
          first
        </div>
        <div
          className={`${color.primary} p-3 rounded-xl cursor-pointer`}
          onClick={() => onPrev()}
        >
          prev
        </div>
        {Array.from({ length: 5 }, (_, i) => {
          prevPage = prevPage - 1;
          if (prevPage >= 0)
            return (
              <div
                onClick={(e) => onClikPage(e.target.textContent)}
                className="border px-1 rounded cursor-pointer"
              >
                {prevPage}
              </div>
            );
        }).reverse()}
        {/* Pagina actual */}
        <div className={`${color.primary} p-1 rounded-xl`}>{page}</div>
        {/* Siguientes */}
        {Array.from({ length: 5 }, (_, i) => {
          nextPage = nextPage + 1;
          if (nextPage <= 660)
            return (
              <div
                onClick={(e) => onClikPage(e.target.textContent)}
                className="border px-1 rounded cursor-pointer "
              >
                {nextPage}
              </div>
            );
        })}
        <div
          className={`${color.primary} p-3 rounded-xl cursor-pointer`}
          onClick={() => onNext()}
        >
          next
        </div>
        <div
          className={`${color.primary} p-3 rounded-xl cursor-pointer`}
          onClick={() => onLast()}
        >
          last
        </div>
      </div>
    </>
  );
}

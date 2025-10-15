"use client";
import { useEffect, useState } from "react";
import Paginator from "@/Components/Paginator";
import { useTheme } from "@/context/themeContext";

export default function Scraping() {
  const [ref, setref] = useState(false);
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(0);

  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  useEffect(() => {
    console.log("procesando...");
    fetch(`api/scraping/opengameart/2d?page=${page}`)
      .then((res) => res.json())
      .then((content) => {
        console.log("HTML:", content);
        setContent(content);
      });
  }, [ref, page]);
  return (
    <>
      <div className={` h-full flex flex-col ${tcolor.primary}`}>
        <div className=" flex-1 grid gap-6 p-4 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]  overflow-y-auto ">
          {content.length > 0 &&
            content.map((c) => (
              <div
                key={c.titulo}
                className={` flex flex-col  justify-center ${color.secondary} rounded-xl h-[150px] overflow-hidden`}
              >
                {/* <h2 className="break-words overflow-wrap-break-word">
                  {c.titulo}
                </h2> */}
                <img src={c.imagen} className="object-contain" />
              </div>
            ))}
        </div>
        {/* Paginacion */}

        <Paginator
          onNext={() => setPage(page + 1)}
          onPrev={() => setPage(page - 1)}
          onLast={() => setPage(660)}
          onFirst={() => setPage(0)}
          page={page}
          onClikPage={(page) => setPage(Number(page))}
        />
      </div>
    </>
  );
}

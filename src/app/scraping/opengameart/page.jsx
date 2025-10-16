"use client";
import { useEffect, useState, useRef } from "react";
import Paginator from "@/Components/Paginator";
import { useTheme } from "@/context/themeContext";
import SkeletonAnimationGrid from "@/skeletons/SkeletonAnimationGrid";
import { useRouter } from "next/navigation";
import NavegateIcon from "@/Icons/NavegateIcon";
import ModalOpengameart from "@/Components/ModalOpengameart";
import { useSize } from "@/context/resizeContext";

export default function Scraping() {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialModalData, setInitialModalData] = useState(null);

  const controllerRef = useRef(null);
  const scrollRef = useRef(null);

  const router = useRouter();
  const { currentTheme } = useTheme();
  const { isMobile } = useSize();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  useEffect(() => {
    // reiniciar el scroll hasta el inicio
    scrollRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;
    console.log("procesando...");
    setLoading(true);
    fetch(
      `${window.location.origin}/api/scraping/opengameart/2d?page=${page}`,
      { signal }
    )
      .then((res) => res.json())
      .then((content) => {
        console.log("HTML:", content);
        setContent(content);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          return console.log("Error trayendo imagenes", error.message);
      });
    return () => controllerRef.current.abort();
  }, [page]);
  return (
    <>
      {/* Modal para mostrar los datos expandidos */}
      <ModalOpengameart initialData={initialModalData} isMobile={isMobile} />

      <div className={` h-full flex flex-col ${tcolor.primary}`}>
        {/* boton retroceder */}
        <div
          onClick={() => router.back()}
          className={`${tcolor.secondary} p-3 flex `}
        >
          <NavegateIcon direcction={-1} /> <p>back</p>
        </div>
        <div
          ref={scrollRef}
          className=" flex-1  gap-6 p-4 grid [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]  overflow-y-auto "
        >
          {loading ? (
            <SkeletonAnimationGrid gap={18} cellCount={24} h={150} />
          ) : (
            content.length > 0 &&
            content.map((c) => (
              <div
                key={c.titulo}
                className={` flex flex-col  justify-center ${color.secondary} rounded-xl h-[150px] overflow-hidden`}
              >
                <img
                  src={c.imagen}
                  className="object-contain"
                  onClick={() =>
                    setInitialModalData({ title: c.titulo, url: c.enlace })
                  }
                />
              </div>
            ))
          )}
        </div>
        {/* Paginacion */}

        <Paginator
          onNext={() => setPage(page + 1)}
          onPrev={() => setPage(page - 1)}
          page={page}
        />
      </div>
    </>
  );
}

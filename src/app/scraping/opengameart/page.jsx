"use client";
import { useEffect, useState, useRef } from "react";
import Paginator from "@/Components/Paginator";
import { useTheme } from "@/context/themeContext";
import SkeletonAnimationGrid from "@/skeletons/SkeletonAnimationGrid";
import { useRouter } from "next/navigation";
import NavegateIcon from "@/Icons/NavegateIcon";
import ModalOpengameart from "@/Components/ModalOpengameart";
import { useSize } from "@/context/resizeContext";
import { _POST_ } from "@/utils/functions";
import { SearchIcon } from "@/Icons/SearchIcon";
import { OPEN_ART_GAME_BASE_PREVIEW_IMG_URL } from "@/scraping/urls";

export default function Scraping() {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialModalData, setInitialModalData] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [refreshPage, setRefreshPage] = useState(false);

  const controllerRef = useRef(null);
  const scrollRef = useRef(null);

  const router = useRouter();
  const { currentTheme } = useTheme();
  const { isMobile } = useSize();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  // buscar por paginas
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
  }, [page, refreshPage]);

  // indexar en db los nombres para qeu esten disponibles para la busqueda
  useEffect(() => {
    if (content.length == 0) return;
    const data = content.map((c) => ({
      title: c.titulo,
      url: c.enlace,
      preview_file_name: c.imagen.split("/").pop(),
    }));

    _POST_(
      `${window.location.origin}/api/scraping/metadata/opengameart-title-references`,
      {
        data: data,
        page,
      }
    )
      .then((res) => res.json())
      .then((res) => console.log("Cacheo de paginas:", res));
  }, [content]);

  function search() {
    if (inputSearch == "") return setRefreshPage(!refreshPage);
    setLoading(true);
    fetch(
      `${window.location.origin}/api/scraping/opengameart/finder?param=${inputSearch}`
    )
      .then((res) => res.json())
      .then(({ results, error }) => {
        if (error) return console.error("Error buscando:", error);
        const content = results.map((r) => ({
          enlace: r.url,
          imagen: OPEN_ART_GAME_BASE_PREVIEW_IMG_URL + r.preview_file_name,
          titulo: r.title,
        }));
        console.log("formateado:", content);
        setContent(content);
        setLoading(false);
      });
  }

  return (
    <>
      {/* Modal para mostrar los datos expandidos */}
      <ModalOpengameart initialData={initialModalData} isMobile={isMobile} />

      <div className={` h-full flex flex-col ${tcolor.primary}`}>
        {/* bloque de navegacion y buscar */}
        <div className="flex items-center justify-between">
          {/* boton retroceder */}
          <div
            onClick={() => router.back()}
            className={`${tcolor.secondary} p-3 flex  `}
          >
            <NavegateIcon direcction={-1} /> <p>back</p>
          </div>
          {/* buscar */}
          <div className=" flex justify-center flex-1  p-2 w-full  ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                search();
              }}
              className=" mx-auto flex items-center space-x-3 w-full max-w-100 px-2"
            >
              <input
                onChange={(e) => setInputSearch(e.target.value)}
                type="text"
                className="w-full border border-gray-400 rounded-xl p-1 px-3 transition-all  "
                placeholder="Search"
              />
              {inputSearch && (
                <div onClick={search} className=" px-2 p-1">
                  <SearchIcon />
                </div>
              )}
            </form>
          </div>
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

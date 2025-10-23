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
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function Scraping() {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialModalData, setInitialModalData] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [refreshPage, setRefreshPage] = useState(false);

  // paginacion del buscador
  const limit = 24;
  const [finderPage, setFinderPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showInputSearchLoader, setShowInputSearchLoader] = useState(false);
  const inputSearchLoaderRef = useInfiniteScroll(
    // infiniteScrollLoadMore,
    async () => await search({ loader: false }),
    hasMore
  );

  const controllerRef = useRef(null);
  const scrollRef = useRef(null);

  const router = useRouter();
  const { currentTheme } = useTheme();
  const { isMobile } = useSize();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  // buscar por paginas
  useEffect(() => {
    // Reiniciar las configuraciones de busqueda por input
    RestartInputSearchConfig();
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
      .then(({ content, error }) => {
        if (content) {
          console.log("HTML:", content);
          setContent(content);
          setLoading(false);
        }
        if (error) {
          console.error("Ocurrio un error buscando assets: ", error);
        }
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

  function handleSubmit(e) {
    e.preventDefault();
    // reiniciar el scroll hasta el inicio
    scrollRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setContent([]);
    setHasMore(true);
    setFinderPage(0);
    search({ loader: true, firstPage: true });
  }

  // buscar por parametros del text area
  async function search({ loader = true, firstPage = false }) {
    if (finderPage == 0) setContent([]);
    if (inputSearch == "") return setRefreshPage(!refreshPage);
    loader && setLoading(true);
    await fetch(
      `${
        window.location.origin
      }/api/scraping/opengameart/finder?param=${inputSearch}&limit=${limit}&page=${
        firstPage ? 0 : finderPage
      }`
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
        setContent((prev) => [...prev, ...content]);
        if (content.length < limit) setHasMore(false);
        setFinderPage((prev) => prev + 1);
        loader && setLoading(false);
        setShowInputSearchLoader(true);
      });
  }

  function RestartInputSearchConfig() {
    setShowInputSearchLoader(false);
    setFinderPage(0);
    setContent([]);
    setHasMore(true);
  }

  // navegacion del modal
  function modalOnNext() {
    const row = content.filter((r) => r.titulo == initialModalData.title);
    const index = content.indexOf(row[0]);
    const next = content[(index + 1) % content.length];
    setInitialModalData({ title: next.titulo, url: next.enlace });
  }

  // navegacion del modal
  function modalOnPrev() {
    const row = content.filter((r) => r.titulo == initialModalData.title);
    const index = content.indexOf(row[0]);
    const next = content[(index - 1 + content.length) % content.length];
    setInitialModalData({ title: next.titulo, url: next.enlace });
  }

  return (
    <>
      {/* Modal para mostrar los datos expandidos */}
      <ModalOpengameart
        initialData={initialModalData}
        isMobile={isMobile}
        onNext={modalOnNext}
        onPrev={modalOnPrev}
      />

      <div className={` relative h-full flex flex-col ${tcolor.primary}`}>
        {/* bloque de navegacion y buscar */}
        <div className="flex items-center justify-between px-1">
          {/* boton retroceder */}
          <div
            onClick={() => router.back()}
            className={`${tcolor.secondary} p-3 flex  `}
          >
            <NavegateIcon direcction={-1} /> <p>back</p>
          </div>
          {/* buscar */}
          <div className=" flex justify-center flex-1  ">
            <form
              onSubmit={(e) => handleSubmit(e)}
              className=" mx-auto flex items-center space-x-3 w-full max-w-100 px-2"
            >
              <input
                onChange={(e) => setInputSearch(e.target.value)}
                type="text"
                className="w-full border border-gray-400 rounded-xl p-1 px-3 transition-all  "
                placeholder="Search"
              />

              <div
                onClick={() => inputSearch && search()}
                className={`px-2 p-1 ${
                  !inputSearch ? "opacity-30" : "opacity-100"
                }`}
              >
                <SearchIcon />
              </div>
            </form>
          </div>
        </div>
        <div
          ref={scrollRef}
          className=" flex-1 p-4 overflow-y-auto   gap-6  grid [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))] "
        >
          {loading ? (
            <SkeletonAnimationGrid gap={18} cellCount={24} h={150} />
          ) : (
            <>
              {content.length > 0 &&
                content.map((c) => (
                  <div
                    key={c.enlace}
                    className={` flex flex-col  justify-center ${color.secondary} rounded-xl h-[150px] overflow-hidden`}
                  >
                    <img
                      src={c.imagen}
                      className="object-contain"
                      onClick={() =>
                        setInitialModalData({
                          title: c.titulo,
                          url: c.enlace,
                        })
                      }
                    />
                  </div>
                ))}
              {/* Loader para el scroll infinito */}
              {showInputSearchLoader &&
                hasMore &&
                Array.from({ length: 8 }, (_, i) => {
                  return (
                    <div
                      key={i}
                      ref={(node) => {
                        if (i == 0) inputSearchLoaderRef(node);
                      }}
                    >
                      <SkeletonAnimationGrid key={i} cellCount={1} h={150} />
                    </div>
                  );
                })}
            </>
          )}
        </div>

        {/* Paginacion */}
        {!inputSearch && (
          <Paginator
            onNext={() => {
              if (page == 660) return;
              setPage(page + 1);
            }}
            onPrev={() => {
              if (page == 0) return;
              setPage(page - 1);
            }}
            page={page}
            onChange={(value) => setPage(Number(value))}
          />
        )}
      </div>
    </>
  );
}

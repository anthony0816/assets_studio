"use client";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
  useCallback,
} from "react";
import { useTheme } from "@/context/themeContext";
import { useLoadingRouter } from "./LoadingRouterProvider";
import { useData } from "@/context/GlobalDataAccesContext";
import { CreateComent } from "@/utils/functions";
import { useAuth } from "@/context/authContext";
import LoadingSpinner from "./LoadingSpiner";
import { GetComentByAsset } from "@/utils/functions";
import ComentCard from "./ComentCard";
import LikeIcon from "@/Icons/LikeIcon";
import ReportButton from "@/Icons/ReportButton";
import { GiveLike } from "@/utils/functions";
import { useInterface } from "@/context/intercomunicationContext";
import ReportForm from "./ReportForm";

const ModalAssetData = forwardRef((props, ref) => {
  // 🔹 Hooks externos / contextos
  const { router } = useLoadingRouter();
  const storage = useData();
  const { onClose } = props;
  const { currentTheme } = useTheme();
  const auth = useAuth();
  const {
    LikeInterface,
    setLikeInterface,
    OpenReportsFormInterface,
    ReportInterface,
    setReportInterface,
  } = useInterface();

  // 🔹 Refs
  const textareaRef = useRef(null);
  const loaderRef = useRef();
  const ReportFormOpenRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // 🔹 Estados de datos principales
  const [asset, setAsset] = useState(null);
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [coments, setComents] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [reports, setReports] = useState(0);
  const [isStarting, setIsStarting] = useState(true);
  const [ReportFormOpen, setReportFormOpen] = useState(false);

  // 🔹 Estados de control / UI
  const [isOpen, setIsOpen] = useState(false);
  const [openWithFocus, setOpenWithFocus] = useState(false);

  // 🔹 Estados de carga / error
  const [isLoadingComents, setIsLoadingComents] = useState(false);
  const [loadingComentsCreation, setLoadingComentsCreation] = useState(false);
  const [fetchingUserError, setfetchingUserError] = useState(false);
  const [loadingLikesInfo, setLoadingLikesInfo] = useState(false);

  useImperativeHandle(ref, () => ({
    open: (asset) => {
      setPage(0);
      setHasMore(true);
      setAsset(asset);
      setComents([]);
      setUser(null);
      setIsOpen(true);
      setReportFormOpen(false);
      setReports(asset.reports.length);
    },
    openAndCreateComent: (asset) => {
      setOpenWithFocus(true);
      setPage(0);
      setHasMore(true);
      setAsset(asset);
      setComents([]);
      setUser(null);
      setIsOpen(true);
      setReportFormOpen(false);
    },
  }));

  {
    /* useffect de la interfaz */
  }

  useEffect(() => {
    if (!ReportInterface) return;

    const { asset_id, report_status } = ReportInterface;
    if (asset_id == asset?.id) {
      if (report_status == 1) return setReports(reports + 1);
    }
  }, [ReportInterface]);

  useEffect(() => {
    if (!LikeInterface) return;
    const { asset_id, liked_status } = LikeInterface;
    if (asset_id == asset?.id) {
      setLikes(likes + liked_status);
      if (liked_status == -1) {
        setLiked(false);
      } else {
        setLiked(true);
      }
    }
  }, [LikeInterface]);

  useEffect(() => {
    if (!OpenReportsFormInterface) return;

    const { to, message } = OpenReportsFormInterface;
    if (to == "ModalAssetData" && message == "open") {
      setReportFormOpen(true);
      setTimeout(() => {
        if (ReportFormOpenRef.current) {
          console.log("exitoso");
          const container = scrollContainerRef.current; // tu div con overflow-y-auto
          const target = ReportFormOpenRef.current;

          if (container && target) {
            const offset = -60; // píxeles extra hacia arriba
            const top =
              target.offsetTop -
              container.offsetTop +
              target.offsetHeight / 2 -
              container.clientHeight / 2 -
              offset;

            container.scrollTo({
              top,
              behavior: "smooth", // animación suave
            });
          }
        }
      }, 300);
    }
  }, [OpenReportsFormInterface]);

  useEffect(() => {
    async function loadLikesInformation() {
      if (!asset) return;
      setLoadingLikesInfo(true);
      const res = await fetch(`api/assets/get/getLikes/${asset.id}`);
      const From_db_Likes = await res.json();

      let boolean = false;
      From_db_Likes.forEach((like) => {
        if (like.user_id == auth.user?.uid) {
          boolean = true;
          return;
        }
      });
      setLiked(boolean);
      setLikes(From_db_Likes.length);
      setIsStarting(false);
      setLoadingLikesInfo(false);
    }
    loadLikesInformation();
  }, [asset]);

  const setTextAreaRef = (el) => {
    textareaRef.current = el;
    if (el && openWithFocus) {
      el.focus();
    }
  };

  const FetchComents = useCallback(async (asset_id) => {
    setIsLoadingComents(true);
    const res = await GetComentByAsset(asset_id, page, limit);
    const data = await res.json();
    if (!res.ok) {
      console.error("Error al traer los comentarios", data);
      setIsLoadingComents(false);
      return;
    }
    console.log("Comentarios Cargados Correctamente", data);
    setComents((prev) => [...prev, ...data]);
    setPage((prev) => prev + 1);
    if (data.length < limit) setHasMore(false);
    setIsLoadingComents(false);
  });

  useEffect(() => {
    if (isOpen == false) return;
    if (page != 0) return;
    FetchComents(asset.id);
  }, [isOpen, page]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (isLoadingComents) return console.log("STOP_Loading...");
          console.log("El elemento está visible, cargar más datos...");
          if (hasMore) FetchComents(asset.id);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    const target = loaderRef.current;

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, FetchComents]);

  async function handleCreateComent(e) {
    e.preventDefault();
    if (!auth.user) {
      router("/login");
      return;
    }

    if (!asset.id) return;
    if (content == "") return;

    setLoadingComentsCreation(true);
    const res = await CreateComent(
      auth.user.uid,
      asset.id,
      content,
      auth.user.name,
      auth.user.avatar
    );

    if (!res.ok) {
      const data = await res.json();
      setLoadingComentsCreation(false);
      return console.error(
        "Error creando el comentario, la respuesta no fue satisfactoria",
        "Data:",
        data
      );
    }
    const data = await res.json();
    console.log(
      "Data satisfactoria desde el backend  de los comentarios",
      data
    );
    setComents((prev) => [data, ...prev]);
    setContent("");
    setLoadingComentsCreation(false);
  }

  async function handleCreateLike() {
    if (isStarting) return;
    const res = await GiveLike(asset.id, liked, auth.user?.uid);
    if (!res.ok) {
      if (res.status == 401) {
        router("/login");
        return;
      }
    }
    const data = await res.json();
    const { id, count } = data;
    if (id) {
      console.log("data from liked asset", data);
      setLikeInterface({ asset_id: asset.id, liked_status: 1 });
      return;
    }
    if (count) {
      setLikeInterface({ asset_id: asset.id, liked_status: -1 });
      return;
    }
  }

  function close() {
    setPage(0);
    setHasMore(true);
    setAsset(null);
    setComents([]);
    setUser(null);
    setIsOpen(false);
    setContent("");
    setOpenWithFocus(false);
    onClose();
    setReportFormOpen(false);
  }

  useEffect(() => {
    if (!asset) return;

    loadDataFromUser();
  }, [asset]);

  async function loadDataFromUser() {
    const res = await GetDataFromUser();
    if (!res.ok) {
      console.error("Error a la hora de hacer el fetch", res);
      setfetchingUserError(true);
      return;
    }
    const data = await res.json();

    setUser(data);
  }

  async function GetDataFromUser() {
    setfetchingUserError(false);
    const res = await fetch("api/user/get", {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify({
        uid: asset.user_id,
      }),
    });
    return res;
  }

  function GoToUserProfile(user) {
    storage.setUserToProfile(user);
    router("/visit_user_profile");
  }

  if (!isOpen) return;
  return (
    <>
      <div
        ref={scrollContainerRef}
        className={`h-full w-full  overflow-y-auto rounded-xl shadow-lg ${currentTheme.colors.secondary} ${currentTheme.textColor.primary}`}
      >
        {/* Imagen principal */}
        <div className="w-full h-64 overflow-hidden rounded-t-xl">
          <img
            src={asset.src}
            alt={`Asset ${asset.id}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Información del asset */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${currentTheme.textColor.secondary}`}>
              {new Date(asset.createdAt).toLocaleDateString()}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${currentTheme.colors.third} ${currentTheme.textColor.secondary}`}
            >
              {asset.categoria}
            </span>
          </div>

          <span
            onClick={() => GoToUserProfile(user)}
            className={`hover:text-blue-500 transition  cursor-pointer`}
          >
            {user?.displayName || (
              <span onClick={(e) => e.stopPropagation()}>
                {fetchingUserError ? (
                  <span
                    onClick={loadDataFromUser}
                    className="text-red-400 cursor-pointer hover:text-red-500"
                  >
                    error, try again🔄
                  </span>
                ) : (
                  "loadind..."
                )}
              </span>
            )}
          </span>

          {/* Likes y Reports */}
          <div className="flex gap-4 text-sm mt-2">
            <span
              onClick={() => handleCreateLike()}
              className={`${currentTheme.textColor.muted} flex items-center cursor-pointer`}
            >
              {loadingLikesInfo ? (
                <LoadingSpinner />
              ) : (
                <>
                  <LikeIcon liked={liked} /> {likes}
                </>
              )}
            </span>
            <span
              className={`${currentTheme.textColor.muted}  flex items-center cursor-pointer`}
              onClick={() => setReportFormOpen(!ReportFormOpen)}
            >
              <ReportButton
                color={currentTheme.colors.buttonReport}
                strokeWidth="3"
              />
            </span>
          </div>
        </div>
        {/* Botón Volver */}
        <div
          onClick={close}
          className={` sticky top-0 cursor-pointer text-center py-3 mt-2 ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} rounded-b-xl`}
        >
          back
        </div>

        {/* Formulario de Reportes */}
        <section
          ref={ReportFormOpenRef}
          className={`${
            ReportFormOpen ? "max-h-full" : "max-h-0"
          } transition-all duration-500  overflow-y-hidden`}
        >
          <ReportForm
            asset_id={asset.id}
            onSucces={() => {
              setReportFormOpen(false);
            }}
            onError={() => null}
          />
        </section>

        {/* Comentarios */}
        <form onSubmit={(e) => handleCreateComent(e)}>
          <h2 className="text-2xl mt-2">Coments</h2>

          <div className="flex flex-col mt-5">
            {loadingComentsCreation ? (
              <LoadingSpinner />
            ) : (
              <button type="submit">➕ Add a coment</button>
            )}

            <textarea
              ref={setTextAreaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // evita salto de línea
                  e.currentTarget.form?.requestSubmit(); // dispara el submit nativo
                }
              }}
              id="createComent"
              placeholder="What do you think?"
              className="w-[90%] m-auto mt-2 px-2 py-1 border-b outline-none rounded-xl"
            />
          </div>
        </form>

        {/* Comentarios de otros usuario */}
        {coments.length === 0 ? (
          <>
            {isLoadingComents ? (
              <div className="  pb-30 flex items-center justify-center w-full h-60 ">
                <LoadingSpinner text={"cargando comentarios..."} />
              </div>
            ) : (
              <div
                className={`pb-50 mt-10 flex flex-col items-center ${currentTheme.textColor.secondary}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  className="mb-2"
                >
                  <path d="M7 7h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H11l-4 3v-3H7a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3z" />
                </svg>
                <span>No coments yet</span>
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="pb-40 mt-10">
              {coments.map((coment) => (
                <ComentCard key={coment.id} coment={coment} />
              ))}
              {hasMore ? (
                <div ref={loaderRef}>
                  <LoadingSpinner />
                </div>
              ) : (
                <div
                  className={`py-6 text-center text-sm ${currentTheme.colors.mutedText}`}
                >
                  No more items to load
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
});

ModalAssetData.displayName = "ModalAssetData";
export default ModalAssetData;

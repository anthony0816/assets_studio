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

const ModalAssetData = forwardRef((props, ref) => {
  // 🔹 Hooks externos / contextos
  const { router } = useLoadingRouter();
  const storage = useData();
  const { onClose } = props;
  const { currentTheme } = useTheme();
  const auth = useAuth();

  // 🔹 Refs
  const textareaRef = useRef(null);
  const loaderRef = useRef();

  // 🔹 Estados de datos principales
  const [asset, setAsset] = useState(null);
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [coments, setComents] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  // 🔹 Estados de control / UI
  const [isOpen, setIsOpen] = useState(false);
  const [openWithFocus, setOpenWithFocus] = useState(false);

  // 🔹 Estados de carga / error
  const [isLoadingComents, setIsLoadingComents] = useState(false);
  const [loadingComentsCreation, setLoadingComentsCreation] = useState(false);
  const [fetchingUserError, setfetchingUserError] = useState(false);

  useImperativeHandle(ref, () => ({
    open: (asset) => {
      setPage(0);
      setHasMore(true);
      setAsset(asset);
      setComents([]);
      setUser(null);
      setIsOpen(true);
    },
    openAndCreateComent: (asset) => {
      setOpenWithFocus(true);
      setPage(0);
      setHasMore(true);
      setAsset(asset);
      setComents([]);
      setUser(null);
      setIsOpen(true);
    },
  }));

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

  async function handleCreateComent() {
    if (!auth.user) {
      router("/login");
      return;
    }

    if (!asset.id) return;
    if (content == "") return;

    setLoadingComentsCreation(true);
    const res = await CreateComent(auth.user.uid, asset.id, content);
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
    setContent("");
    setLoadingComentsCreation(false);
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
              className={`${currentTheme.textColor.muted} flex items-center cursor-pointer`}
            >
              <LikeIcon /> {asset.likes?.length || 0}
            </span>
            <span
              className={`${currentTheme.textColor.muted}  flex items-center cursor-pointer`}
            >
              <ReportButton />{" "}
              <div className="ml-1">{asset.reports?.length || 0}</div>
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
        {/* Comentarios */}
        <h2 className="text-2xl mt-2  ">Coments</h2>
        <div className="flex flex-col mt-5">
          {loadingComentsCreation ? (
            <LoadingSpinner />
          ) : (
            <button onClick={handleCreateComent}>➕Add a coment</button>
          )}

          <textarea
            ref={setTextAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            id="createComent"
            placeholder="What do you think?"
            type="text"
            className=" w-[90%] m-auto mt-2 px-2 py-1 border-b outline-none  rounded-xl "
          />
        </div>
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

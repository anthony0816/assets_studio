import { useEffect, useState, useRef } from "react";
import Modal from "./Modal";
import { useTheme } from "@/context/themeContext";
import CloseIcon from "@/Icons/CloseIcon";
import SkeletonAnimationGrid from "@/skeletons/SkeletonAnimationGrid";
import { SaveIcon } from "@/Icons/SaveIcon";
import { DownloadIcon } from "@/Icons/DownloadIcon";
import {
  downloadPhotoFromUrl,
  AssetToBase64FromOpengameart,
  CreateAsset,
} from "@/utils/functions";
import { useEventListener } from "@/hooks/useEventListener";
import { useAuth } from "@/context/authContext";
import LoadingSpinner from "./LoadingSpiner";
import { RetryIcon } from "@/Icons/RetryIcon";

export default function ModalOpengameart({
  initialData,
  isMobile = false,
  onNext,
  onPrev,
}) {
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;
  const { user } = useAuth();

  const [urls, setUrls] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [savingAssetError, setSavingAssetError] = useState(false);
  const [savingAsset, setSavingAsset] = useState(false);

  const [loadPhotoError, setLoadPhotoError] = useState({});

  const controlleRef = useRef(null);

  // Escuchar la navegacion d
  useEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") return onPrev();
    if (e.key === "ArrowRight") return onNext();
  });

  useEffect(() => {
    controlleRef.current = new AbortController();
    const signal = controlleRef.current.signal;

    if (!initialData) return;
    console.log("Ejecutando modal", initialData);
    setIsOpen(true);
    setLoading(true);
    fetch(
      `${window.location.origin}/api/scraping/opengameart/content?url=${initialData.url}`,
      { signal }
    )
      .then((res) => res.json())
      .then(({ urls, error }) => {
        console.log(urls, "error:", error);
        if (error) return;
        setUrls(urls);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") return console.error(error);
      });
    return () => controlleRef.current.abort();
  }, [initialData]);

  function saveAsset(row) {
    if (savingAsset) return;
    setSavingAsset(true);
    setSavingAssetError(false);
    AssetToBase64FromOpengameart(row.url, row.url.split("/").pop()).then(
      ({ error, base64 }) => {
        if (base64) {
          // crear la instancia
          if (user == "await" || user == null) {
            setSavingAsset(false);
            return alert("No session active, can't save the asset ");
          }
          CreateAsset(base64, user.uid, user.providerId, "opengameart").then(
            ({ url, error }) => {
              if (error) {
                setSavingAsset(false);
                setSavingAssetError(true);
                return console.error("Error Creando Asset:", error);
              }
              if (url) {
                setSavingAsset(false);
                return console.log("Guardado con exito:", url);
              }
            }
          );
        }
        if (error) {
          setSavingAsset(false);
          setSavingAssetError(true);
          return console.error("Error guardando imagen", error);
        }
      }
    );
  }

  function close() {
    setIsOpen(false);
    setUrls([]);
    setSavingAssetError(false);
    setSavingAsset(false);
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={close} showButtomnClose={false}>
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${tcolor.primary} ${color.secondary}  w-full h-full  ${
            isMobile ? "max-h-130" : "max-w-200  max-h-150"
          }  rounded-xl`}
        >
          <div className=" flex justify-end border-b border-b-gray-500">
            <button onClick={close} className="p-2">
              <CloseIcon size={30} />
            </button>
          </div>
          <h2 className="text-center p-2 font-bold">{initialData?.title}</h2>

          <div className=" overflow-y-auto h-[80%] ">
            <div className="flex flex-col justify-center gap-10 rounded mt-10">
              {loading ? (
                <div className="w-[90%] mx-auto ">
                  <SkeletonAnimationGrid cellCount={1} h={400} />
                </div>
              ) : (
                urls.map((row) => (
                  <div
                    key={row.url}
                    className={` ${color.third} flex items-center  w-[90%] min-h-50 mx-auto relative rounded-xl `}
                  >
                    {!loadPhotoError[row.url] && (
                      <div
                        className={`flex items-center absolute top-2 right-2 space-x-4 text-gray-300 `}
                      >
                        <button
                          onClick={() => saveAsset(row)}
                          className="bg-black/80 p-2 rounded-xl "
                        >
                          {savingAsset ? (
                            <LoadingSpinner color={"white"} />
                          ) : savingAssetError ? (
                            <RetryIcon />
                          ) : (
                            <SaveIcon />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            downloadPhotoFromUrl(
                              row.url,
                              row.url.split("/").pop()
                            )
                          }
                          className="bg-black/80 p-2 rounded-xl "
                        >
                          <DownloadIcon />
                        </button>
                      </div>
                    )}
                    <img
                      className={`w-full h-full  object-contain `}
                      src={row.url}
                      alt={`Asset de ${initialData?.title}`}
                      onError={() =>
                        setLoadPhotoError((prev) => ({
                          ...prev,
                          [row.url]: true,
                        }))
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

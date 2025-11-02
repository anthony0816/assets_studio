import { forwardRef, useImperativeHandle, useState } from "react";
import { DownloadIcon } from "@/Icons/DownloadIcon";
import { DowloadCloudinaryAsset } from "@/utils/functions";
import Modal from "./Modal";
import LoadingSpinner from "./LoadingSpiner";
import { useEventListener } from "@/hooks/useEventListener";

const ModalShowPicture = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const { nextAsset, prevAsset } = props;

  useImperativeHandle(ref, () => ({
    open: (asset) => {
      setAsset(asset);
      setIsOpen(true);
    },
    foward: (asset) => {
      setAsset(asset);
    },
    backwards: (asset) => {
      setAsset(asset);
    },
    currentAsset: () => asset,
  }));

  // navegacion por las flechas
  useEventListener("keydown", (e) => {
    if (isOpen) {
      if (e.key === "ArrowRight") {
        setLoading(true);
        nextAsset();
      }
      if (e.key === "ArrowLeft") {
        setLoading(true);
        prevAsset();
      }
      e.key === "Escape" && setIsOpen(false);
    }
  });

  if (!isOpen) return null;
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        backgroundOpacity={"50"}
      >
        {/* Contenedor del modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative  rounded-lg shadow-lg p-6 max-w-5xl w-full flex flex-col items-center"
        >
          {/* Boton Descargar Asset */}
          <button
            onClick={() => DowloadCloudinaryAsset(asset.src)}
            className="fixed top-4 right-20 text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition text-4xl leading-none"
          >
            <DownloadIcon size={40} />
          </button>

          <div className="relative w-full flex items-center justify-center">
            {/* Flecha izquierda */}
            <button
              onClick={() => {
                setLoading(true);
                prevAsset();
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-4xl text-gray-700 dark:text-gray-200 hover:text-blue-500 transition z-10"
            >
              ‹
            </button>

            {/* Imagen del asset */}
            <div className="  w-full h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-black">
              <div className="relative w-full h-[70vh]">
                <div
                  className={`absolute inset-0 flex justify-center items-center bg-black/70 transition duration-300 ${
                    loading ? "opacity-100" : "opacity-0"
                  } `}
                >
                  <LoadingSpinner />
                </div>

                <img
                  src={asset?.src}
                  alt="Asset"
                  className=" w-full h-full object-contain"
                  onLoad={() => setLoading(false)}
                />
              </div>
            </div>

            {/* Flecha derecha */}
            <button
              onClick={() => {
                setLoading(true);
                nextAsset();
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-4xl text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
            >
              ›
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
});

ModalShowPicture.displayName = "ModalShowPicture";
export default ModalShowPicture;

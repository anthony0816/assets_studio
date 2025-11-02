import { forwardRef, useImperativeHandle, useState } from "react";
import { DownloadIcon } from "@/Icons/DownloadIcon";
import { DowloadCloudinaryAsset } from "@/utils/functions";
import Modal from "./Modal";

const ModalShowPicture = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [asset, setAsset] = useState(null);
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
  if (!isOpen) return null;
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {/* Contenedor del modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-5xl w-full flex flex-col items-center"
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
              onClick={prevAsset}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-4xl text-gray-700 dark:text-gray-200 hover:text-blue-500 transition"
            >
              ‹
            </button>

            {/* Imagen del asset */}
            <div className="w-full h-[70vh] flex items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
              <img
                src={asset?.src}
                alt="Asset"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Flecha derecha */}
            <button
              onClick={nextAsset}
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

import { forwardRef, useImperativeHandle, useState } from "react";
const ModalShowPicture = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [asset, setAsset] = useState(false);
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
  console.log("asset", asset);
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
        {/* Contenedor del modal */}
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-5xl w-full flex flex-col items-center">
          {/* Botón cerrar grande */}
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-4 right-4 text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition text-4xl leading-none"
          >
            ✕
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
            <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
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
      </div>
    </>
  );
});

ModalShowPicture.displayName = "ModalShowPicture";
export default ModalShowPicture;

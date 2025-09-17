"use client";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTheme } from "@/context/themeContext";

const ModalAssetData = forwardRef((props, ref) => {
  const [asset, setAsset] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { onClose } = props;
  const { currentTheme } = useTheme();

  useImperativeHandle(ref, () => ({
    open: (asset) => {
      setAsset(asset);
      setIsOpen(true);
    },
  }));

  function close() {
    setAsset(null);
    setIsOpen(false);
    onClose();
  }

  useEffect(() => {}, []);

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

          {/* Likes y Reports */}
          <div className="flex gap-4 text-sm">
            <span className={currentTheme.textColor.muted}>
              ❤️ {asset.likes?.length || 0}
            </span>
            <span className={currentTheme.textColor.muted}>
              🚩 {asset.reports?.length || 0}
            </span>
          </div>
        </div>

        {/* Botón cerrar */}
        <div
          onClick={close}
          className={` sticky top-0 cursor-pointer text-center py-3 mt-2 ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} rounded-b-xl`}
        >
          Cerrar
        </div>
      </div>
    </>
  );
});

ModalAssetData.displayName = "ModalAssetData";
export default ModalAssetData;

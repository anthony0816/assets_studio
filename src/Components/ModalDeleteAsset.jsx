"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { useInterface } from "@/context/intercomunicationContext";
import LoadingSpinner from "./LoadingSpiner";

export default function ModalDeleteAsset() {
  const { currentTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [callBack, setCallback] = useState();
  const [loading, setLoading] = useState(false);
  const { ModalDeleteAssetInterface, setModalDeleteAssetInterface } =
    useInterface();

  useEffect(() => {
    if (!ModalDeleteAssetInterface) return;
    const { to, callBack } = ModalDeleteAssetInterface;
    if (to == "ModalDeleteAsset") {
      setCallback(() => callBack);
      setOpen(true);
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => setIsVisible(true), 10);
    }
  }, [ModalDeleteAssetInterface]);

  async function handleConfirm() {
    setLoading(true);
    await callBack();
    setLoading(false);
    closeModal();
  }

  function closeModal() {
    setIsVisible(false);
    // Esperar a que termine la animación antes de remover el modal
    setTimeout(() => {
      setOpen(false);
      setModalDeleteAssetInterface(null);
    }, 300);
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Fondo oscuro con transición */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeModal}
      ></div>

      {/* Contenedor del modal con transición */}
      <div
        className={`relative z-10 p-6 rounded-lg shadow-lg transition-all duration-300 transform ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        } ${currentTheme.colors.primary} ${currentTheme.textColor.primary} ${
          currentTheme.colors.border
        } border max-w-md w-full mx-4`}
      >
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to delete this asset?
        </h2>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded ${currentTheme.colors.buttonPrimary} ${currentTheme.colors.buttonPrimaryHover} text-white disabled:opacity-50 transition-opacity`}
          >
            {loading ? <LoadingSpinner color="white" px={"px-3"} /> : "Accept"}
          </button>
          <button
            onClick={closeModal}
            disabled={loading}
            className={`px-4 py-2 rounded ${currentTheme.colors.secondary} ${currentTheme.colors.hover} ${currentTheme.textColor.primary} disabled:opacity-50 transition-opacity`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

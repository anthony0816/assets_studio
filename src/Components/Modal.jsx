import { useClickOutside } from "@/utils/hooks";
import { useRef } from "react";

export default function Modal({
  children,
  isOpen = false,
  onClose,
  showButtomnClose = true,
  modalAbsolute,
  backgroundOpacity = "80",
}) {
  const modalRef = useRef(null);
  useClickOutside(modalRef, () => isOpen && onClose());
  if (isOpen)
    return (
      <>
        <div
          ref={modalRef}
          onClick={onClose}
          className={`animate-[fadeIn_0.3s_ease-in-out] ${
            modalAbsolute ? "absolute" : "fixed"
          } inset-0 flex items-center justify-center z-50  bg-black/${backgroundOpacity}`}
        >
          {showButtomnClose && (
            <button
              onClick={onClose}
              className="fixed top-4 right-4 text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition text-4xl leading-none"
            >
              ✕
            </button>
          )}
          {children}
        </div>
      </>
    );
}

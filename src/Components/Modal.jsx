import { useClickOutside } from "@/utils/hooks";
import { useRef } from "react";
export default function Modal({
  children,
  isOpen = false,
  onClose,
  showButtomnClose = true,
  modalAbsolute,
}) {
  const modalRef = useRef(null);
  useClickOutside(modalRef, onClose);
  return (
    <>
      <div
        ref={modalRef}
        onClick={onClose}
        className={`  ${
          modalAbsolute ? "absolute" : "fixed"
        } inset-0 flex items-center justify-center z-50 bg-black/80 transition-all duration-300 ${
          isOpen ? "opacity-100 visible  " : "opacity-0 invisible"
        } `}
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

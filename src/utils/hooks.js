import { useEffect } from "react";

// Para manejar un clik fuera del componente
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
}

export function useCenterElement(container, target) {
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

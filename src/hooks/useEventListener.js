import { useEffect, useRef } from "react";

export function useEventListener(event, handler) {
  const handlerRef = useRef(handler);

  // Actualizar la referencia si handler cambia
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (e) => handlerRef.current(e);

    document.addEventListener(event, eventListener);
    return () => document.removeEventListener(event, eventListener);
  }, [event]);
}

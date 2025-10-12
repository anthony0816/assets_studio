// hooks/useInfiniteScroll.js
import { useEffect, useCallback, useState } from "react";

export const useInfiniteScroll = (loadMore, hasMore, options = {}) => {
  const [element, setElement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { threshold = 1.0, rootMargin = "0px", enabled = true } = options;

  const stableLoadMore = useCallback(loadMore, [loadMore]);

  // Callback ref que se ejecuta cuando el elemento se monta/desmonta
  const loadingRef = useCallback((node) => {
    if (node !== null) {
      setElement(node);
    }
  }, []);

  useEffect(() => {
    if (!element || !enabled || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading && hasMore) {
          console.log("El elemento está visible, cargar más datos...");
          setIsLoading(true);
          stableLoadMore()
            .then(() => {
              setIsLoading(false);
            })
            .catch((error) => {
              console.log("Error cargando notificaciones", error);
              setIsLoading(false);
            });
        } else if (entry.isIntersecting && isLoading) {
          console.log("STOP_Loading...");
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    element,
    stableLoadMore,
    hasMore,
    isLoading,
    threshold,
    rootMargin,
    enabled,
  ]);

  return loadingRef;
};

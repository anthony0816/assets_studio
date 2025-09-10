"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
const RouterContext = createContext();

export function LoadingRouterProvider({ children }) {
  const Router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const router = async (url) => {
    if (url != pathname) {
      setIsLoading(true);
      Router.push(url);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <>
      <RouterContext.Provider value={{ router, isLoading }}>
        {children}
      </RouterContext.Provider>
    </>
  );
}

export function useLoadingRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    console.error("debe usarse en un componete dentro del provider");
  }
  return context;
}

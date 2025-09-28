"use client";
import { createContext, useContext, useState } from "react";

const interfaceContext = createContext();

export function InterfaceContextProvider({ children }) {
  const [LikeInterface, setLikeInterface] = useState(null);
  const [OpenReportsFormInterface, setOpenReportsFormInterface] =
    useState(null);
  const [ModalDeleteAssetInterface, setModalDeleteAssetInterface] =
    useState(null);

  return (
    <interfaceContext.Provider
      value={{
        LikeInterface,
        setLikeInterface,
        OpenReportsFormInterface,
        setOpenReportsFormInterface,
        ModalDeleteAssetInterface,
        setModalDeleteAssetInterface,
      }}
    >
      {children}
    </interfaceContext.Provider>
  );
}

export function useInterface() {
  const context = useContext(interfaceContext);
  if (!context)
    return console.error("Necesita usar useInterface dentro de su provider");
  return context;
}

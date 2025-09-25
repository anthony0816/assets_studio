"use client";
import { createContext, useContext, useState } from "react";

const interfaceContext = createContext();

export function InterfaceContextProvider({ children }) {
  const [LikeInterface, setLikeInterface] = useState(null);
  const [OpenReportsFormInterface, setOpenReportsFormInterface] =
    useState(null);
  const [ReportInterface, setReportInterface] = useState(null);

  return (
    <interfaceContext.Provider
      value={{
        LikeInterface,
        setLikeInterface,
        OpenReportsFormInterface,
        setOpenReportsFormInterface,
        ReportInterface,
        setReportInterface,
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

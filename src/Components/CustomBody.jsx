"use client";
import { useSize } from "@/context/resizeContext";

export default function CustomBody({ children }) {
  const { isMobile } = useSize();
  return (
    <>
      <main className={`flex flex-${isMobile ? "col" : "row"} w-full`}>
        {children}
      </main>
    </>
  );
}

"use client";
import { useSize } from "@/context/resizeContext";
import { useTheme } from "@/context/themeContext";

export default function Frame({ children }) {
  const { isMobile } = useSize();
  const { currentTheme } = useTheme();
  return (
    <>
      <section
        className={` ${
          currentTheme.colors.primary
        } w-full h-[100vh] overflow-y-auto ${isMobile && "pt-[72px]"}`}
      >
        {children}
      </section>
    </>
  );
}

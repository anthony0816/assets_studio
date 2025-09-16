"use client";
import { useEffect, useState } from "react";
import { useLoadingRouter } from "./LoadingRouterProvider";
import { useTheme } from "@/context/themeContext";

export default function GlobalLoader({ children }) {
  const { isLoading } = useLoadingRouter();
  const [LoandingAnimation, setLoandigAnimation] = useState(false);
  const { currentTheme } = useTheme();
  useEffect(() => {
    setLoandigAnimation(isLoading);
  }, [isLoading]);

  if (!LoandingAnimation) return children;
  if (LoandingAnimation) {
    return (
      <div
        className={`flex items-center justify-center h-screen w-screen ${currentTheme.colors.primary}`}
      >
        <div className="flex space-x-2">
          <div
            className={`w-4 h-4 ${currentTheme.colors.buttonPrimary} rounded-full animate-bounce [animation-delay:.1s]`}
          ></div>
          <div
            className={`w-4 h-4 ${currentTheme.colors.buttonPrimary} rounded-full animate-bounce [animation-delay:.3s]`}
          ></div>
          <div
            className={`w-4 h-4 ${currentTheme.colors.buttonPrimary} rounded-full animate-bounce [animation-delay:.5s]`}
          ></div>
        </div>
      </div>
    );
  }
}

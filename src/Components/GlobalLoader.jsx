"use client";
import { useEffect, useState } from "react";
import { useLoadingRouter } from "./LoadingRouterProvider";

export default function GlobalLoader({ children }) {
  const { isLoading } = useLoadingRouter();
  const [LoandingAnimation, setLoandigAnimation] = useState(false);

  useEffect(() => {
    setLoandigAnimation(isLoading);
  }, [isLoading]);

  if (!LoandingAnimation) return children;
  if (LoandingAnimation) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:.1s]"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:.5s]"></div>
        </div>
      </div>
    );
  }
}

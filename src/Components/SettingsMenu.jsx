"use client";
import { useTheme } from "@/context/themeContext";
import { useState, useEffect } from "react";

export default function SettingsMenu({
  isOpen,
  OpenNavFunction = null,
  iconWidth = "30",
  iconHeigth = "30",
  menuIconWidth = "24",
  menuIconHeigth = "24",
  marginBetween = "",
}) {
  const { currentTheme, isBlackTheme, setIsBlackTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false);
    }
  }, [isOpen]);
  return (
    <>
      <div className={`${currentTheme.textColor.primary}`}>
        <span
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (OpenNavFunction) return OpenNavFunction();
          }}
          className={`p-1 flex flex-row items-center ${
            currentTheme.colors.hover
          } cursor-pointer ${!isOpen && "justify-center"} relative group`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            width={iconWidth}
            height={iconHeigth}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.57-.907 3.356.879 2.45 2.45a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.907 1.57-.879 3.356-2.45 2.45a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.57.907-3.356-.879-2.45-2.45a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.907-1.57.879-3.356 2.45-2.45.97.56 2.2.132 2.573-1.065Z"
            />
            <circle cx="12" cy="12" r="3.25" />
          </svg>

          {isOpen && <span className="ml-2"> ajustes</span>}
        </span>

        <div
          className={`flex justify-center transition-all duration-400 overflow-hidden mt-${marginBetween} ${
            isExpanded
              ? "max-h-98 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={() => {
              localStorage.setItem("isDark", !isBlackTheme);
              setIsBlackTheme(!isBlackTheme);
            }}
            className={`${
              isOpen && "border"
            } w-[60%] py-1 rounded-xl flex justify-center ${
              currentTheme.colors.hover
            } transition cursor-pointer`}
          >
            {isBlackTheme ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width={menuIconWidth}
                height={menuIconHeigth}
                aria-hidden="true"
              >
                <path d="M12 4.5a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1Zm0 17a1 1 0 0 1-1-1V20a1 1 0 1 1 2 0v.5a1 1 0 0 1-1 1ZM4.5 13H3a1 1 0 1 1 0-2h1.5a1 1 0 1 1 0 2Zm17 0H20a1 1 0 1 1 0-2h1.5a1 1 0 1 1 0 2ZM6.34 6.34a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41L6.34 6.34Zm12.73 12.73a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-1.06 1.06ZM6.34 17.66l-1.06 1.06a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41Zm12.73-12.73-1.06 1.06a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 0 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

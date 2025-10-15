"use client";

import LoadingSpinner from "@/Components/LoadingSpiner";
import { useTheme } from "@/context/themeContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ScrapingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState({});

  const items = [
    { name: "Open Game Art", route: "/scraping/opengameart" },
    // { name: "swrgnurwn", route: "/my-assets" },
    // { name: "evg", route: "/login" },
    // { name: "rbhet" },
    // { name: "rbrw" },
    // { name: "rbgrwhwr" },
    // { name: "rnernetjet" },
  ];
  const { currentTheme } = useTheme();
  const tcolor = currentTheme.textColor;
  const color = currentTheme.colors;

  function navegate(route) {
    let stop = false;
    Object.keys(loading).forEach((key) => {
      if (loading[key]) {
        stop = loading[key];
      }
    });
    if (stop) return;
    setLoading((prev) => ({ ...prev, [route]: true }));
    router.push(route);
  }

  return (
    <>
      <main className="max-w-200  mx-auto ">
        <h2
          className={`${tcolor.secondary} mt-4 text-center font-bold text-xl `}
        >
          AVIABLE PAGES
        </h2>
        <div className=" mt-10 px-2 gap-3 grid [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]  ">
          {items.map((item) => (
            <div
              onClick={() => navegate(item.route)}
              className={`h-25 mx-auto w-full max-w-100  flex justify-center items-center rounded ${color.secondary}  ${tcolor.secondary}  font-bold ${color.hover} transition duration-300 active:scale-95`}
              key={item.name}
            >
              {loading[item.route] ? (
                <LoadingSpinner />
              ) : (
                <div> {item.name}</div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

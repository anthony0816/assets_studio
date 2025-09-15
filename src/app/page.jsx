"use client";
import { useTheme } from "@/context/themeContext";
import { useLoadingRouter } from "@/Components/LoadingRouterProvider";

export default function Home() {
  const { currentTheme } = useTheme();
  const color = currentTheme.colors;
  const tcolor = currentTheme.textColor;

  const { router } = useLoadingRouter();

  return (
    <main className={`${color.primary} min-h-screen flex flex-col`}>
      {/* Hero */}
      <section
        className={`flex flex-col items-center justify-center flex-1 p-6 text-center ${tcolor.primary}`}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to{" "}
          <span className={`${tcolor.secondary}`}>Assets Studio</span>
        </h1>
        <p className={`max-w-2xl ${tcolor.secondary} text-lg md:text-xl mb-8`}>
          Manage, explore, and share your assets quickly and securely, with a
          visual and streamlined workflow.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => router("/login")}
            className={`${color.secondary} ${tcolor.primary} px-6 py-3 rounded-lg hover:${color.fourth} transition`}
          >
            Login
          </button>
          <button
            onClick={() => router("/allAssets")}
            className={`${color.third} ${tcolor.primary} px-6 py-3 rounded-lg hover:${color.fourth} transition`}
          >
            Explore Assets
          </button>
        </div>
      </section>

      {/* Sección de características */}
      <section className={`${color.secondary} py-12 px-6`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-6 rounded-lg shadow-lg ${color.third}`}>
            <h3 className={`text-xl font-semibold mb-2 ${tcolor.primary}`}>
              Download your assets
            </h3>
            <p className={`${tcolor.secondary}`}>
              here you can find whatever you need to start building your
              videogame
            </p>
          </div>
          <div className={`p-6 rounded-lg shadow-lg ${color.third}`}>
            <h3 className={`text-xl font-semibold mb-2 ${tcolor.primary}`}>
              Yo are in control
            </h3>
            <p className={`${tcolor.secondary}`}>
              Bad content you may find here can be reportend and proceces once
              you decide it
            </p>
          </div>
          <div className={`p-6 rounded-lg shadow-lg ${color.third}`}>
            <h3 className={`text-xl font-semibold mb-2 ${tcolor.primary}`}>
              Create Assets
            </h3>
            <p className={`${tcolor.secondary}`}>
              You can create your assets, let the world know and get some money
              for it
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${color.third} ${tcolor.secondary} text-center py-4`}>
        © {new Date().getFullYear()} Assets Studio — Todos los derechos
        reservados.
      </footer>
    </main>
  );
}

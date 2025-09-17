"use client";
import { useTheme } from "@/context/themeContext";
import { useLoadingRouter } from "@/Components/LoadingRouterProvider";

export default function Home() {
  const { currentTheme } = useTheme();
  const color = currentTheme.colors;
  const tcolor = currentTheme.textColor;

  const { router } = useLoadingRouter();

  return (
    <main className={`${color.primary} h-[100%] overflow-auto flex flex-col`}>
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
            className={`${color.secondary} ${tcolor.primary} px-6 py-3 rounded-lg ${color.hover} transition`}
          >
            Login
          </button>
          <button
            onClick={() => router("/allAssets")}
            className={`${color.third} ${tcolor.primary} px-6 py-3 rounded-lg ${color.hover} transition`}
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
              Find everything you need to kickstart your video game project.
            </p>
          </div>
          <div className={`p-6 rounded-lg shadow-lg ${color.third}`}>
            <h3 className={`text-xl font-semibold mb-2 ${tcolor.primary}`}>
              You are in control
            </h3>
            <p className={`${tcolor.secondary}`}>
              Report and manage any inappropriate content at your convenience.
            </p>
          </div>
          <div className={`p-6 rounded-lg shadow-lg ${color.third}`}>
            <h3 className={`text-xl font-semibold mb-2 ${tcolor.primary}`}>
              Create Assets
            </h3>
            <p className={`${tcolor.secondary}`}>
              Create your own assets, share them with the world, and get paid.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${color.third} ${tcolor.secondary} text-center py-4`}>
        © {new Date().getFullYear()} Assets Studio — All rigth reserved.
      </footer>
    </main>
  );
}

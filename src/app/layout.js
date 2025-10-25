import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavBar from "@/Components/NavBar";
import Frame from "@/Components/Frame";
import { SizeContextProvider } from "@/context/resizeContext";
import { LoadingRouterProvider } from "@/Components/LoadingRouterProvider";
import GlobalLoader from "@/Components/GlobalLoader";
import { ThemeContextProvider } from "@/context/themeContext";
import CustomBody from "@/Components/CustomBody";
import AuthContextProvaider from "@/context/authContext";
import { GlobalDataAccesContextProvider } from "@/context/GlobalDataAccesContext";
import { InterfaceContextProvider } from "@/context/intercomunicationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Assets Studio",
  description:
    "Sistema para la búsqueda de assets e interacción con los usuarios. Crea una cuenta e interactúa creando contenido para la plataforma o generando assets con inteligencia artificial.",
  icons: {
    icon: "/app_logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InterfaceContextProvider>
          <SizeContextProvider>
            <LoadingRouterProvider>
              <ThemeContextProvider>
                <AuthContextProvaider>
                  <GlobalDataAccesContextProvider>
                    <CustomBody>
                      <NavBar />
                      <GlobalLoader>
                        <Frame>{children}</Frame>
                      </GlobalLoader>
                    </CustomBody>
                  </GlobalDataAccesContextProvider>
                </AuthContextProvaider>
              </ThemeContextProvider>
            </LoadingRouterProvider>
          </SizeContextProvider>
        </InterfaceContextProvider>
      </body>
    </html>
  );
}

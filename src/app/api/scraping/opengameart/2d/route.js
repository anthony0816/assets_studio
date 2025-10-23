import { TWO_D_ASSETS_BASE_URL } from "@/scraping/urls";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    const html = await fetch(TWO_D_ASSETS_BASE_URL + "&page=" + page).then(
      (res) => res.text()
    );
    const $ = cheerio.load(html);

    const imageCard = $(".views-row");

    const resultados = [];
    imageCard.each((i, elem) => {
      // Titulo de cada clasificacion
      const titulo = $(elem).find(".art-preview-title > a").text().trim();
      // Buscar todos los <a> que contengan <img> dentro
      const enlacesConImg = $(elem).find("a:has(img)");

      enlacesConImg.each((i, elem) => {
        const href = $(elem).attr("href");
        const imgSrc = $(elem).find("img").attr("src");
        const texto = $(elem).text().trim();

        resultados.push({
          enlace: href,
          imagen: imgSrc,
          texto: texto,
          titulo: titulo,
        });
      });
    });

    return NextResponse.json({ content: resultados });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error desconocido" });
  }
}

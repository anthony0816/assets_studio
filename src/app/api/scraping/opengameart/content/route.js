import { NextResponse } from "next/server";
import { TWO_D_CONTENT_BASE_URL } from "@/scraping/urls";
import * as cheerio from "cheerio";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const html = await fetch(`${TWO_D_CONTENT_BASE_URL}${url}`).then((res) =>
      res.text()
    );
    const $ = cheerio.load(html);
    const urls = [];
    const photosContainer = $(".group-right");
    photosContainer.each((i, elem) => {
      const links = $(elem).find("a:has(img)");
      links.each((i, elem) => {
        urls.push({ url: $(elem).attr("href") });
      });
    });
    return NextResponse.json({ urls });
  } catch (error) {
    return NextResponse.json({ error: error.message || "error desconocido" });
  }
}

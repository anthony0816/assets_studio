import { NextResponse } from "next/server";
import { TWO_D_CONTENT_BASE_URL } from "@/scraping/urls";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const html = await fetch(`${TWO_D_CONTENT_BASE_URL}${url}`).then((res) =>
      res.text()
    );

    return NextResponse.json(html);
  } catch (error) {
    return NextResponse.json({ error: error.message || "error desconocido" });
  }
}

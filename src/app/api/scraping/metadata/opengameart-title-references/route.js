import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import translate from "translate";

export async function POST(request) {
  try {
    const { data, page } = await request.json();
    // verificar si ya la pagina fue completamente cacheada anteriormente
    const cachedPage =
      await prisma.opengameart_title_url_cached_page.findUnique({
        where: { numPage: Number(page) },
      });
    console.log("cahedPAge:", cachedPage);
    if (cachedPage) throw new Error(`La página ${page} ya está cacheadada`);

    // si no esta cacheada ya seguimos con el resto del codigo
    const title_es = await Promise.all(
      data.map((d) => translate(d.title, { from: "en", to: "es" }))
    );
    for (let index = 0; index < data.length; index++) {
      data[index].title_es = title_es[index];
    }

    const results = await prisma.opengameart_title_url.createMany({
      data: data,
      skipDuplicates: true,
    });
    // si la pagina se cacheo completa dejaremos de traducir tb
    if (results) {
      if (results.count == 0) {
        await prisma.opengameart_title_url_cached_page.create({
          data: {
            numPage: Number(page),
          },
        });
      }
    }
    /**model opengameart_title_url{
  url String @id 
  title String
  title_es String
  preview_file_name String // se usa para referenciar la preview de la busqueda 
} */
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error desconocido" });
  }
}

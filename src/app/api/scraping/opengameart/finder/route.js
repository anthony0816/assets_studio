import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const param = searchParams.get("param");
    const limit = Number(searchParams.get("limit"));
    const page = Number(searchParams.get("page"));

    // Controllar que el limit no sea demasiado alto
    if (limit >= 50) throw new Error("Limite de paginacion permitido exedido");

    // separando y cosntruyendo la estructura del or que necesita prisma
    const sterms = param.split(" ").filter((term) => term.trim() != "");
    const searchTerms = sterms.flatMap((sterm) => [
      {
        title: {
          contains: sterm,
          mode: "insensitive",
        },
      },
      {
        title_es: {
          contains: sterm,
          mode: "insensitive",
        },
      },
    ]);

    const results = await prisma.opengameart_title_url.findMany({
      where: {
        OR: searchTerms,
      },
      skip: page * limit,
      take: limit,
    });

    /*model opengameart_title_url{
  url String @id 
  title String
  title_es String
  preview_file_name String // se usa para referenciar la preview de la busqueda 
} */
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error desconocido" });
  }
}

import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const param = searchParams.get("param");
    const results = await prisma.opengameart_title_url.findMany({
      where: {
        OR: [
          {
            title: {
              contains: param,
              mode: "insensitive",
            },
          },
          {
            title_es: {
              contains: param,
              mode: "insensitive",
            },
          },
        ],
      },
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

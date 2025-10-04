import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { VerifySesion } from "@/utils/functions";
import { adminAuth } from "@/libs/firebase-admin";

// 🔹 Definimos el include una sola vez
const includeParams = {
  likes: true,
  reports: true,
  _count: { select: { coments: true } },
};

export async function POST(request) {
  try {
    const { param, page, limit, freeAcces } = await request.json();

    // Comprobar si es free acces o no
    if (!freeAcces) {
      const session = VerifySesion(request, adminAuth);
      if (!session)
        return NextResponse.json(
          { error: "Unauthorized", session },
          { status: 401 }
        );
    }

    // Tratar los parametros si son de tipo categoria de los assets
    if (param.startsWith("cat-")) {
      const categoria = param.split("-")[1];
      return NextResponse.json(
        await prisma.asset.findMany({
          where: { categoria },
          include: includeParams,
          skip: page * limit,
          take: limit,
        })
      );
    }

    // Tratar parametros de tipo search
    if (param.startsWith("search-")) {
      const value = param.split("-")[1];
      var results = [];

      // funcion para buscar por atributos
      async function search(atribute, value) {
        const res = await prisma.asset.findMany({
          where: { [atribute]: value },
          include: includeParams,
          skip: page * limit,
          take: limit,
        });
        return res;
      }

      // buscar por categoria
      results = await search("categoria", value);

      // busca por el formato de la imagen
      if (results.length == 0) {
        results = await search("format", value);
      }

      //buscar por nombre de usuario
      if (results.length == 0) {
        const { uid } = await prisma.user.findUnique({
          where: {
            name: value,
          },
          select: {
            uid: true,
          },
        });

        if (uid) {
          results = await search("user_id", uid);
        }
      }

      return NextResponse.json(results);
    }

    switch (param) {
      case "explore":
        return NextResponse.json(
          await prisma.asset.findMany({
            skip: page * limit,
            take: limit,
            include: includeParams,
          })
        );

      case "moreliked":
        return NextResponse.json(
          await prisma.asset.findMany({
            skip: page * limit,
            take: limit,
            orderBy: { likes: { _count: "desc" } },
            include: includeParams,
          })
        );

      case "lessliked":
        return NextResponse.json(
          await prisma.asset.findMany({
            skip: page * limit,
            take: limit,
            orderBy: { likes: { _count: "asc" } },
            include: includeParams,
          })
        );

      case "lastest":
        return NextResponse.json(
          await prisma.asset.findMany({
            skip: page * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: includeParams,
          })
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "error en los filtros",
      },
      { status: 500 }
    );
  }
}

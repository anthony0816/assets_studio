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
      const query = param.split("-")[1];
      // limpiar valores de busqueda repetidos
      const terms = query.split(" ").filter((term) => term.trim() != "");
      const searchTermns = terms.map((term) => ({
        name: {
          contains: term,
          mode: "insensitive",
        },
      }));

      const tags = await prisma.assetTag.findMany({
        where: {
          OR: searchTermns,
        },
        include: {
          assets: {
            include: includeParams,
          },
        },
        skip: page * limit,
        take: limit,
      });

      const results = tags.map((tag) => tag.assets).flat();
      console.log("length", results.length);
      console.log("results", results);
      const uniqueResults = [
        ...new Map(results.map((item) => [item.id, item])).values(),
      ];
      return NextResponse.json(uniqueResults);
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

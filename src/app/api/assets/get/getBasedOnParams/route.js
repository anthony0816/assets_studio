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
      let values = query.split(" ");
      values = [
        ...new Map(
          values.map((v) => [v.trim().toLowerCase(), v.trim()])
        ).values(),
      ];
      var results = [];

      // funcion para buscar por atributos
      async function search(atribute, value) {
        const res = await prisma.asset.findMany({
          where: {
            [atribute]: {
              equals: value,
              mode: "insensitive",
            },
          },
          include: includeParams,
          skip: page * limit,
          take: limit,
        });
        return res;
      }

      for (const value of values) {
        // buscar por categoria
        const results_1 = await search("categoria", value);
        results.push(...results_1);

        // busca por el formato de la imagen

        const results_2 = await search("format", value);
        results.push(...results_2);

        //buscar por nombre de usuario

        const uids = await prisma.user.findMany({
          where: {
            name: {
              equals: value,
              mode: "insensitive", // ignonar minusculas y mayusculas
            },
          },
          select: {
            uid: true,
          },
        });
        console.log("resultados", uids);
        if (uids.length > 0) {
          const searchPromises = uids.map((uid) => search("user_id", uid.uid));
          const searchResults = await Promise.all(searchPromises);

          searchResults.forEach((result) => {
            results.push(...result); // Desempaca cada sub-array
          });
        }

        const tags = await prisma.assetTag.findMany({
          where: {
            name: {
              equals: value,
              mode: "insensitive",
            },
          },
          include: {
            assets: {
              include: {
                likes: true,
                reports: true,
                _count: { select: { coments: true } },
              },
            },
          },
        });

        const results_3 = tags.map((tag) => tag.assets).flat();
        results.push(...results_3);
      }

      // por ultimo filtrar por dublicados
      console.log(results);
      results = [...new Map(results.map((item) => [item.id, item])).values()];
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

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { VerifySesion } from "@/utils/functions";
import { adminAuth } from "@/libs/firebase-admin";

export async function POST(request) {
  try {
    const { param, page, limit, freeAcces } = await request.json();

    {
      /* Comprobar si es free acces o no  */
    }
    if (!freeAcces) {
      const session = VerifySesion(request, adminAuth);
      if (!session)
        return NextResponse.json(
          { error: "Unauthorized", session },
          { status: 401 }
        );
    }

    if (param.startsWith("cat-")) {
      const categoria = param.split("-")[1];
      return NextResponse.json(
        await prisma.asset.findMany({
          where: {
            categoria: categoria,
          },
          include: {
            likes: true,
            reports: true,
          },
          skip: page * limit,
          take: limit,
        })
      );
    }

    switch (param) {
      case "explore":
        return NextResponse.json(
          await prisma.asset.findMany({
            skip: page * limit,
            take: limit,
            include: {
              likes: true,
              reports: true,
            },
          })
        );

      case "moreliked":
        return NextResponse.json(
          await prisma.asset.findMany({
            skip: page * limit,
            take: limit,
            orderBy: { likes: "desc" },
            include: {
              likes: true,
              reports: true,
            },
          })
        );
      case "lessliked":
        return NextResponse.json(
          await prisma.asset.findMany({
            skip: page * limit,
            take: limit,
            orderBy: { likes: "asc" },
            include: {
              likes: true,
              reports: true,
            },
          })
        );

      case "lastest":
        return NextResponse.json(
          await prisma.asset.findMany({
            skip: page * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
              likes: true,
              reports: true,
            },
          })
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error.messaje || " error en los filtros",
      },
      { status: 500 }
    );
  }
}

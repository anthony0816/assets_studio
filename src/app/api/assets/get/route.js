import { VerifySesion } from "@/utils/functions";
import { adminAuth } from "@/libs/firebase-admin";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// 🔹 Definimos el include una sola vez
const includeParams = {
  likes: true,
  reports: true,
  _count: { select: { coments: true } },
};

export async function GET(params) {
  return NextResponse.json("hola mundo");
}

export async function POST(request) {
  try {
    const {
      user_id,
      page,
      limit,
      categoria = null,
      freeAcces,
    } = await request.json();

    // Comprobar si es free acces
    if (!freeAcces) {
      const session = await VerifySesion(request, adminAuth);

      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized", session },
          { status: 401 }
        );
      }
    }

    if (categoria) {
      const assets = await prisma.asset.findMany({
        where: { categoria },
        include: includeParams,
        skip: page * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(assets);
    }

    if (user_id) {
      const assets = await prisma.asset.findMany({
        where: { user_id },
        include: includeParams,
        skip: page * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(assets);
    }

    const assets = await prisma.asset.findMany({
      include: includeParams,
      skip: page * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al generar la imagen" },
      { status: 500 }
    );
  }
}

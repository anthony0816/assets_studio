import { adminAuth } from "@/libs/firebase-admin";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { ValidateSession } from "@/libs/session";

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

      freeAcces,
    } = await request.json();

    // Comprobar si es free access
    if (!freeAcces) {
      if (!ValidateSession(request, adminAuth)) {
        return NextResponse.json(
          { error: "Unauthorized", session },
          { status: 401 }
        );
      }
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

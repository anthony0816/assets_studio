import { VerifySesion } from "@/utils/functions";
import { adminAuth } from "@/libs/firebase-admin";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(params) {
  return NextResponse.json("hola mundo");
}

export async function POST(request) {
  try {
    const session = await VerifySesion(request, adminAuth);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", session },
        { status: 401 }
      );
    }

    const { user_id, page, limit, categoria = null } = await request.json();

    if (categoria) {
      const assets = await prisma.asset.findMany({
        where: {
          categoria: categoria,
        },
        skip: page * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(assets);
    }

    if (user_id) {
      const assets = await prisma.asset.findMany({
        where: {
          user_id: user_id,
        },
        skip: page * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(assets);
    }

    const assets = await prisma.asset.findMany({
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

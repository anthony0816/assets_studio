import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { skip } from "@prisma/client/runtime/library";

export async function POST(req) {
  try {
    const { asset_id, page, limit } = await req.json();
    const coments = await prisma.coment.findMany({
      where: {
        asset_id: asset_id,
      },
      skip: page * limit,
      take: limit,
    });
    return NextResponse.json(coments);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al Cargar los comentarios",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

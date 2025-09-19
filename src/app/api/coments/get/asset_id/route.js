import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(req) {
  try {
    const data = await req.json();
    const coments = await prisma.coment.findMany({
      where: data,
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

import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { VerifySesion } from "@/utils/functions";
import { adminAuth } from "@/libs/firebase-admin";

export async function POST(req) {
  try {
    const session = await VerifySesion(req, adminAuth);
    if (!session)
      return NextResponse.json(
        { messaje: "Session no activa" },
        { status: 401 }
      );

    const data = await req.json();

    const coment = await prisma.coment.create({
      data: data,
    });

    return NextResponse.json(coment);
  } catch (error) {
    return NextResponse.json(
      {
        messaje: "ha ocurrido un error creando el comentario",
        error: error.messaje,
      },
      { status: 500 }
    );
  }
}

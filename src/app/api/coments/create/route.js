import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { adminAuth } from "@/libs/firebase-admin";
import { ValidateSession } from "@/libs/session";

export async function POST(req) {
  try {
    if ((await ValidateSession(req, adminAuth)) == false)
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

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { VerifySesion } from "@/utils/functions";
import { adminAuth } from "@/libs/firebase-admin";

export async function POST(reques) {
  const res = await VerifySesion(reques, adminAuth);
  if (!res) return NextResponse({ mensaje: "No se encuentra autenticado" });

  try {
    const { base64, id, user_providerId } = await reques.json();
    const asset = await prisma.asset.create({
      data: {
        src: base64,
        user_id: id,
        user_providerId,
      },
    });
    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error("Error en POST /api/asset:", error);

    return NextResponse.json(
      {
        message: "Error al crear asset",
        error: error.message, // mensaje legible
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined, // solo en dev
      },
      { status: 500 }
    );
  }
}

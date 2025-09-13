import { VerifySesion } from "@/utils/functions";
import { adminAuth } from "@/libs/firebase-admin";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(params) {
  return NextResponse.json("hola mundo");
}

export async function POST(request) {
  try {
    const { user_id } = await request.json();
    const assets = await prisma.asset.findMany({
      where: {
        user_id: user_id,
      },
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

import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const asset = await prisma.asset.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        reports: true,
        coments: true,
        likes: true,
      },
    });
    return NextResponse.json({ asset });
  } catch (error) {
    return NextResponse.json({
      error: error.message || "Error desconocido",
    });
  }
}
/**likes Like[]
  reports Report[]
  coments Coment[] */

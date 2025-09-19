import { adminAuth } from "@/libs/firebase-admin";
import { prisma } from "@/libs/prisma";
import { VerifySesion } from "@/utils/functions";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const session = await VerifySesion(request, adminAuth);
    if (!session)
      return NextResponse.json(
        { messaje: "Session no activa" },
        { status: 401 }
      );

    const data = await request.json();
    const like = await prisma.like.create({
      data: data,
    });
    return NextResponse.json(like, { status: 200 });
  } catch (error) {
    console.error("error:", error, error.messaje);
    return NextResponse.json(
      {
        error: error.messaje || "Error creando like",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await VerifySesion(request, adminAuth);
    if (!session)
      return NextResponse.json(
        { messaje: "Session no activa" },
        { status: 401 }
      );

    const data = await request.json();

    const like = await prisma.like.deleteMany({
      where: {
        user_id: data.user_id,
        asset_id: data.asset_id,
      },
    });
    return NextResponse.json(like, { status: 200 });
  } catch (error) {
    console.error("error:", error, error.messaje);
    return NextResponse.json(
      {
        error: error.messaje || "Error creando like",
      },
      { status: 500 }
    );
  }
}

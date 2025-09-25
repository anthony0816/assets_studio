import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { VerifySesion } from "@/utils/functions";
import { adminAuth } from "@/libs/firebase-admin";

export async function POST(request, params) {
  try {
    const session = await VerifySesion(request, adminAuth);

    if (!session)
      return NextResponse.json(
        {
          message: "No hay session activa",
        },
        { status: 401 }
      );

    const { asset_id, user_id, type, description } = await request.json();
    const report = await prisma.report.create({
      data: {
        asset_id: asset_id,
        user_id: user_id,
        type: type,
        description: description,
      },
    });
    return NextResponse.json({ report: report }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
        message: "error al crear la instancia",
      },
      { status: 500 }
    );
  }
}

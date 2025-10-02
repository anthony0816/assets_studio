import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { adminAuth } from "@/libs/firebase-admin";
import { ValidateSession } from "@/libs/session";

export async function POST(request, params) {
  try {
    if ((await ValidateSession(request, adminAuth)) == false)
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

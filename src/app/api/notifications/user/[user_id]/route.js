import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { user_id } = await params;

    const notifications = await prisma.notifications.findMany({
      where: {
        user_id,
      },
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({
      error: error.message || " error desconocido ",
    });
  }
}

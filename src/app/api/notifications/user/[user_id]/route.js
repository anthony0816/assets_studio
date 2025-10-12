import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { user_id } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page"));
    const limit = Number(searchParams.get("limit"));
    console.log("aaaaaaaaaaaaaa", page, limit);

    const notifications = await prisma.notifications.findMany({
      where: {
        user_id,
      },
      skip: page * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({
      error: error.message || " error desconocido ",
    });
  }
}

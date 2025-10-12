import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const { ids } = await request.json();
    const count = await prisma.notifications.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        read: true,
      },
    });
    return NextResponse.json({ count: count });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error desconocido" });
  }
}

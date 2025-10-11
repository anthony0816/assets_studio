import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const notification = await prisma.notifications.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ notification });
  } catch (error) {
    return NextResponse.json({
      error: error.message || " error desconocido ",
    });
  }
}

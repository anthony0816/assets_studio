import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    const user = await prisma.user.findUnique({
      where: {
        uid: uid,
      },
    });

    if (!user)
      return NextResponse.json({
        noUser: true,
      });

    return NextResponse.json({
      p_user: user,
    });
  } catch (p_error) {
    return NextResponse.json({
      p_error: p_error.message || "error desconocido",
    });
  }
}

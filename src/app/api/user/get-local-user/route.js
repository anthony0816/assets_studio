import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const res = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return NextResponse.json({ currentUser: res });
  } catch (error) {
    return NextResponse.json({
      error: error.message || "no se puede leer el mensaje de error ",
    });
  }
}

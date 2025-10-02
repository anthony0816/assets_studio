import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    const { longName, username, password, email, avatar } =
      await request.json();

    const user = await prisma.user.create({
      data: {
        longName,
        name: username,
        password,
        email,
        avatar,
      },
    });
    return NextResponse.json({ success: true, user: user });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Error al crear la instancia",
      },
      { status: 500 }
    );
  }
}

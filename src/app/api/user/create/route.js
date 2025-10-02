import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { longName, username, password, email, avatar } =
      await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        longName,
        name: username,
        password: hashedPassword,
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

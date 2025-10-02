import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, password } = await request.json();
    const existentUser = await prisma.user.findUnique({
      where: {
        name,
      },
    });
    if (!existentUser)
      return NextResponse.json({ error: "username does not exist" });

    const isValid = await bcrypt.compare(password, existentUser.password);

    if (!isValid) return NextResponse.json({ error: "pass do not match" });

    return NextResponse.json({ user: existentUser });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Error desconocido de autenticacion",
      },
      { status: 500 }
    );
  }
}

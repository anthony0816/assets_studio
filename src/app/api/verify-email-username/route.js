import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    const { username, email } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    const emailUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) return NextResponse.json({ userExist: true });
    if (emailUser) return NextResponse.json({ userEmailExist: true });

    return NextResponse.json({ status: true, message: "hola" });
  } catch (error) {
    console.error("error:", error.message || "no se sabe la causa");
    return NextResponse.json({ error: true });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request, params) {
  const { code, email, password, cpassword } = await request.json();

  // Verification for the passwords to match
  if (password !== cpassword)
    return NextResponse.json(
      {
        error: "pass not match",
      },
      { status: 400 },
    );

  // existencial of the code
  const verificationCode = await prisma.verificationCode.findUnique({
    where: { email },
  });

  console.log('verification code:', verificationCode)

  if (!verificationCode)
    return NextResponse.json({ error: "code not found" }, { status: 404 });

  // verify for expiration
  if (verificationCode.expiresAt < new Date())
    return NextResponse.json({ error: "expired" }, { status: 400 });
  // verify for used
  if (verificationCode.used)
    return NextResponse.json({ error: "used" }, { status: 400 });

  // compare the hash
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
  if (verificationCode.code !== hashedCode)
    return NextResponse.json({ error: "code not match" }, { status: 400 });

  //update user password

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // mark code as read
    await prisma.verificationCode.update({
      where: { email },
      data: { used: true },
    });

    return NextResponse.json({ message: "updated" }, { status: 200 });
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma error: record not found
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    console.log("Email:", process.env.EMAIL_USER);
    console.log("contrasena:", process.env.EMAIL_PASS);
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    // Generar código de verificación (6 dígitos)
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Hashear el código antes de guardarlo
    const hashedCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    // Guardar en DB (sobrescribe si ya existe para ese email)
    await prisma.verificationCode.upsert({
      where: { email },
      update: {
        code: hashedCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
        createdAt: new Date(Date.now()),
        used: false,
      },
      create: {
        email,
        code: hashedCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        createdAt: new Date(Date.now()),
        used: false,
      },
    });

    // Configurar transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verifica tu email - Assets Studio",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verificación de Email</h2>
          <p>Tu código de verificación es:</p>
          <h1 style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px;">
            ${verificationCode}
          </h1>
          <p>Este código expira en 10 minutos.</p>
          <p>Si no solicitaste este código, ignora este email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Email de verificación enviado",
      code: process.env.NODE_ENV === "development" ? verificationCode : null,
    });
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json(
      {
        error: `Error enviando email de verificación : ${error}`,
        failed: true,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}

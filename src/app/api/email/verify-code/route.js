import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email y código son requeridos" },
        { status: 400 }
      );
    }

    // Buscar registro
    const record = await prisma.verificationCode.findUnique({
      where: { email },
    });

    if (!record) {
      return NextResponse.json(
        { error: "No se encontró un código para este email" },
        { status: 404 }
      );
    }

    // Verificar si ya fue usado
    if (record.used) {
      return NextResponse.json(
        { error: "Este código ya fue utilizado" },
        { status: 400 }
      );
    }

    // Verificar expiración
    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "El código ha expirado" },
        { status: 400 }
      );
    }

    // Comparar hash
    const hashedInput = crypto.createHash("sha256").update(code).digest("hex");

    if (record.code !== hashedInput) {
      return NextResponse.json({ error: "Código incorrecto" }, { status: 400 });
    }

    // Marcar como usado
    await prisma.verificationCode.update({
      where: { email },
      data: { used: true },
    });

    return NextResponse.json({
      success: true,
      message: "Código verificado correctamente",
    });
  } catch (error) {
    console.error("Error verificando código:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}

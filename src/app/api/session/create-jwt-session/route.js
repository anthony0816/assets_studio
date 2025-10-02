import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Clave secreta (usa process.env.JWT_SECRET en producción)
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Payload del token
    const payload = { email };

    // Crear JWT con expiración
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    // Crear respuesta
    const response = NextResponse.json({ success: true });

    // Guardar cookie HTTP-Only
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session-jwt",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error creating session" },
      { status: 500 }
    );
  }
}

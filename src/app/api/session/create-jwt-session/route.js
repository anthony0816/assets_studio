import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    // Setear cookie segura
    response.cookies.set("session", token, {
      httpOnly: true, // no accesible desde JS
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error creating session" },
      { status: 500 }
    );
  }
}

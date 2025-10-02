import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    // Leer la cookie "session"
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No session token found" },
        { status: 401 }
      );
    }

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Si es válido, devolvemos los datos del payload
    return NextResponse.json({
      success: true,
      user: decoded, // aquí estará { email, iat, exp }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

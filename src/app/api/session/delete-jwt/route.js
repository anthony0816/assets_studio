import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      message: "Sesión cerrada",
    });

    // Sobrescribir la cookie "session" con expiración inmediata
    response.cookies.set("session-jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0, // 👈 expira inmediatamente
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}

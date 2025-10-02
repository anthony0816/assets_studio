import { cookies } from "next/headers";
import { adminAuth } from "@/libs/firebase-admin";

export async function POST(request) {
  const { token } = await request.json();

  try {
    // Validar token de Firebase
    const decoded = await adminAuth.verifyIdToken(token);

    // Guardar cookie HTTP-Only
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 3 hora
    });

    return Response.json({ message: "Sesión creada", uid: decoded.uid });
  } catch (error) {
    return Response.json({ error: "Token inválido" }, { status: 401 });
  }
}

export async function DELETE() {
  // Borrar cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return Response.json({ message: "Sesión cerrada" });
}

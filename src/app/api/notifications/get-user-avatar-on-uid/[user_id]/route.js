import { NextResponse } from "next/server";
import { adminAuth } from "@/libs/firebase-admin";

export async function GET(request, { params }) {
  try {
    const { user_id } = await params;
    // buscar en prisma
    const user = await prisma.user.findUnique({
      where: {
        uid: user_id,
      },
      select: {
        avatar: true,
      },
    });
    if (user) return NextResponse.json({ avatar: user.avatar });

    // Comprobar si el usuario es de Firebase
    const { photoURL } = await adminAuth.getUser(user_id);
    if (photoURL) return NextResponse.json({ avatar: photoURL });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error Desconocido" });
  }
}

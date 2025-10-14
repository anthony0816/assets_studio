import { NextResponse } from "next/server";
import { adminAuth } from "@/libs/firebase-admin";
import { prisma } from "@/libs/prisma";

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

    // buscar en los que ya se han cacheado a ver si Esta la row
    const cachedUser_avatar = await prisma.user_avatar_cache.findUnique({
      where: { user_id },
    });
    if (cachedUser_avatar) {
      return NextResponse.json({
        avatar: cachedUser_avatar.avatarUrl,
        from_cache: true,
      });
    }

    // < Si tampoco esta cacheado Comprobar si el usuario es de Firebase
    const { photoURL } = await adminAuth.getUser(user_id);

    if (photoURL) {
      // Guardar en una tabla cache en la base de datos para no traer todo el objeto de nuevo desde firebase
      try {
        await prisma.user_avatar_cache.create({
          data: {
            user_id,
            avatarUrl: photoURL,
          },
        });
      } catch (error) {
        console.error("Error cacheando user_avatar ");
      }
    }

    return NextResponse.json({ avatar: photoURL });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Error Desconocido" });
  }
}

import { NextResponse } from "next/server";
import cloudinary from "@/libs/cloudinary";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const { old_avatar, new_avatar, user_id } = data;
    const old_avatar_public_id = getPublicId(old_avatar);

    // subir la nueva imagen
    const result = await cloudinary.uploader.upload(new_avatar, {
      folder: "user-avatars",
      resource_type: "image",
    });

    // eliminar la imagen vieja si existe la imagen en cloudinary
    let cloudinaryRes;
    if (old_avatar_public_id) {
      cloudinaryRes = await cloudinary.uploader.destroy(old_avatar_public_id, {
        invalidate: true,
      });
    }

    const prismaRes = await prisma.user.update({
      where: {
        uid: user_id,
      },
      data: {
        avatar: result.secure_url,
      },
    });

    return NextResponse.json({
      url: result.secure_url,
      "Eliminado?": cloudinaryRes,
      "Actualizado?": prismaRes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}

function getPublicId(url) {
  try {
    // 1. Quitar todo antes de "upload/"
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    // 2. Tomar la parte después de upload/
    let path = parts[1];

    // 3. Quitar el versionado (ej: v123456789/)
    path = path.replace(/^v\d+\//, "");

    // 4. Quitar la extensión (.jpg, .png, etc.)
    const withoutExt = path.replace(/\.[^/.]+$/, "");

    return withoutExt;
  } catch (err) {
    return null;
  }
}

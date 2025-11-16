// app/api/assets/upload/route.js
import cloudinary from "@/libs/cloudinary";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    const { base64, uid, user_providerId, categoria, keyWords } =
      await request.json();
    // Verificar cantidad de palabras
    if (keyWords.length < 1 || keyWords.length > 20) {
      const error = new Error(
        "no se aceptan menos de 1 etiquetas ni mas de 10"
      );
      error.name = "keyWordError";
      throw error;
    }

    // verificar que sean validas
    keyWords.forEach((word) => {
      if (!isValidWord(word)) {
        const error = new Error("entrada de palabras no valida");
        error.name = "keyWordError";
        throw error;
      }
    });

    const folder = "assets-studio";

    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: "image",
    });

    await prisma.asset.create({
      data: {
        src: result.secure_url,
        user_id: uid,
        user_providerId,
        categoria: categoria,
        public_id: result.public_id,
        format: result.format,
        tags: {
          connectOrCreate: keyWords.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
    });
    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Error subiendo a Cloudinary:", error);
    return NextResponse.json(
      { error: error.message || "error subiendo imagen" },
      { status: 500 }
    );
  }
}

// Funcion para verificar que la palabra se avalida
function isValidWord(word) {
  const maxLength = 50;

  // Verificar longitud
  if (word.trim().length === 0 || word.trim().length > maxLength) return false;

  // Verificar caracteres prohibidos
  if (/[<>{}[\]\\]/.test(word)) return false;

  return true;
}

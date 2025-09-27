// app/api/assets/upload/route.js
import cloudinary from "@/libs/cloudinary";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    const { base64, id, user_providerId, categoria } = await request.json();
    console.error("Categoria", categoria);
    const folder = "assets-studio";

    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: "image",
    });

    await prisma.asset.create({
      data: {
        src: result.secure_url,
        user_id: id,
        user_providerId,
        categoria: categoria,
        public_id: result.public_id,
        format: result.format,
      },
    });
    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Error subiendo a Cloudinary:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

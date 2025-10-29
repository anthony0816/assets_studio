// app/api/assets/upload/route.js
import cloudinary from "@/libs/cloudinary";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    const { base64, uid, user_providerId, categoria, keyWords } =
      await request.json();

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

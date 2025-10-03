import cloudinary from "@/libs/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { base64 } = await request.json();

    const folder = "user-avatars";
    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: "image",
    });
    return NextResponse.json({ url: result.url });
  } catch (error) {
    return NextResponse.json({
      error: error.message || "Error desconocido",
    });
  }
}

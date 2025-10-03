import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcryptjs";
import cloudinary from "@/libs/cloudinary";

export async function POST(request) {
  try {
    const { longName, username, password, email, avatar_base64 } =
      await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    {
      /* Subir la foto a cloundinary */
    }
    let avatar = "";
    if (avatar_base64) {
      if (avatar_base64 != "") {
        const folder = "user-avatars";
        const result = await cloudinary.uploader.upload(avatar_base64, {
          folder,
          resource_type: "image",
        });
        avatar = result.secure_url;
      }
    }

    const user = await prisma.user.create({
      data: {
        longName,
        name: username,
        password: hashedPassword,
        email,
        avatar: avatar,
      },
    });
    return NextResponse.json({ success: true, user: user });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Error al crear la instancia",
      },
      { status: 500 }
    );
  }
}

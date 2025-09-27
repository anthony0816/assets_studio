import { NextResponse } from "next/server";
import cloudinary from "@/libs/cloudinary";
import { prisma } from "@/libs/prisma";

export async function POST(request) {
  try {
    const { id, public_id } = await request.json();

    const prismaRes = await prisma.asset.delete({
      where: {
        id,
      },
    });
    const cloudinaryRes = await cloudinary.uploader.destroy(public_id, {
      invalidate: true,
    });

    return NextResponse.json(
      { DeleteContext: { prisma: prismaRes, cloudinary: cloudinaryRes } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Error son mensaje ",
      },
      { status: 500 }
    );
  }
}

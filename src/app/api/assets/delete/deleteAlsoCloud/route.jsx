import { NextResponse } from "next/server";
import cloudinary from "@/libs/cloudinary";
import { prisma } from "@/libs/prisma";
import { adminAuth } from "@/libs/firebase-admin";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { id, public_id } = await request.json();

    // Identificar quien hizo la peticion
    const user = await IdentifyRequestUser(request, adminAuth);

    // Verificar si el asset que se quiere eliminar es ese usuario
    const isOwner = await VerifyAssetOwnership(user.uid, id);
    console.log({ isOwner });

    // si no es el creador y tampoco es administrador se deniega
    if (!isOwner && user.roll != "admin")
      throw new Error("invalid to delete a not owned asset");

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

async function IdentifyRequestUser(request, adminAuth) {
  // verificar si la session es de un usuario de firebase
  const firebase_session = request.cookies.get("session")?.value;
  if (firebase_session) {
    try {
      const decoded = await adminAuth.verifyIdToken(firebase_session);
      return decoded.uid;
    } catch (error) {
      console.log("User not found in Firebase");
    }
  }

  // verificar si la session es de un usuario local
  const token = request.cookies.get("session-jwt")?.value;
  if (token) {
    try {
      const { email } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await findUserByEmail(email);
      return user;
    } catch (error) {
      console.log("User not found in local or Error:", error.message || "");
    }
  }
  return null;
}

// funcion para encontrar los datos necesarios del usuario
async function findUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      uid: true,
      roll: true,
    },
  });
  return user;
}

// verificar si el asset le pertenece
async function VerifyAssetOwnership(request_user_id, asset_id) {
  const { user_id } = await prisma.asset.findUnique({
    where: {
      id: asset_id,
    },
    select: {
      user_id: true,
    },
  });
  return request_user_id == user_id;
}

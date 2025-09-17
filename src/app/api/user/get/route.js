import { adminAuth } from "@/libs/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid } = await req.json();

    // Obtener el usuario por UID
    const userRecord = await adminAuth.getUser(uid);

    // Puedes devolver todo el objeto o solo lo que necesites
    return NextResponse.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      providerData: userRecord.providerData,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      },
    });
  } catch (error) {
    console.error("Error obteniendo usuario:", error, error.message);
    return NextResponse.json(
      {
        error: "No se pudo obtener el usuario",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

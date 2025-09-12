import { NextResponse } from "next/server";
import { VerifySesion } from "@/utils/functions";
import { adminAuth } from "@/libs/firebase-admin";

export async function POST(request) {
  try {
    const session = await VerifySesion(request, adminAuth);
    if (!session)
      return NextResponse.json(
        { error: "No tiene sesion activa" },
        { status: 500 }
      );

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt es requerido" },
        { status: 400 }
      );
    }

    // URL CORREGIDA - usa el endpoint de inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: 512,
            height: 512,
            num_inference_steps: 50,
            guidance_scale: 7.5,
          },
        }),
      }
    );
    console.log("respuesta de la IA", response);
    console.log("Status:", response.status);

    if (!response.ok) {
      let errorMsg = "Error en la generación";
      try {
        const errorData = await response.text();
        errorMsg = errorData || errorMsg;
      } catch {
        // Si no se puede leer el error
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: response.status }
      );
    }

    // Convertir la imagen a base64
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al generar la imagen" },
      { status: 500 }
    );
  }
}

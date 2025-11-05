import { NextResponse } from "next/server";
import { adminAuth } from "@/libs/firebase-admin";
import { ValidateSession } from "@/libs/session";

export async function POST(request) {
  try {
    if ((await ValidateSession(request, adminAuth)) == false)
      return NextResponse.json(
        { error: "No tiene sesion activa" },
        { status: 500 }
      );

    const { prompt } = await request.json();
    const Style =
      " full body, 2D vector design, flat colors, clean lines, no shading, isolated on a plain white background, fantasy illustration, character design sheet, vibrant colors, highly detailed";

    const finalPromp = prompt + Style;

    const modelos = {
      base: "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      refiner:
        "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-refiner-1.0",
      juger:
        "https://router.huggingface.co/hf-inference/models/stabilityai/juggernaut-xl-v8",
    };

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt es requerido" },
        { status: 400 }
      );
    }

    // URL CORREGIDA - usa el endpoint de inference API
    const response = await fetch(modelos.base, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: finalPromp,
        parameters: {
          width: 512,
          height: 512,
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }),
    });

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

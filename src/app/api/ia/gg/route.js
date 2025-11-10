import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const { promp } = await request.json();
    console.log({ promp });
    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promp,
      });
      console.log(response.text);
      return response.text;
    }

    const response = await main();
    return NextResponse.json({ res: response });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "error desconocido" },
      { status: 500 }
    );
  }
}

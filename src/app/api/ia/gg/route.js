import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works in a few words",
      });
      console.log(response.text);
      return response;
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

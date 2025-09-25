import { NextResponse } from "next/server";

export async function POST(request, params) {
  const data = await request.json();
  return NextResponse.json(data);
}

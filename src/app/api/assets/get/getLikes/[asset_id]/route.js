import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request, { params }) {
  const { asset_id } = await params;

  const likes = await prisma.like.findMany({
    where: {
      asset_id: Number(asset_id),
    },
  });
  return NextResponse.json(likes);
}

import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { user_id, redirectionUrl, message } = await request.json();
    const notification = await prisma.notifications.create({
      data: {
        user_id,
        redirectionUrl,
        message,
      },
    });
    return NextResponse.json({ notification });
  } catch (error) {
    return NextResponse.json({
      error: error.message || " error desconocido ",
    });
  }
}

/*model Notifications{
id Int @id @default(autoincrement())
createdAt DateTime @default(now())
message String
redirectionUrl String
user user @relation(fields: [user_id], references: [uid], onDelete: Cascade)
user_id String
} */

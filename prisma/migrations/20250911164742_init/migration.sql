/*
  Warnings:

  - You are about to drop the column `name` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `likes` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reports` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `src` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."USER_ROLL" AS ENUM ('administrador', 'cliente');

-- AlterTable
ALTER TABLE "public"."Asset" DROP COLUMN "name",
DROP COLUMN "type",
ADD COLUMN     "likes" INTEGER NOT NULL,
ADD COLUMN     "reports" INTEGER NOT NULL,
ADD COLUMN     "src" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "longName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roll" "public"."USER_ROLL" NOT NULL DEFAULT 'cliente',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `userPhotoUrl` to the `Coment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Coment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Coment" ADD COLUMN     "userPhotoUrl" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

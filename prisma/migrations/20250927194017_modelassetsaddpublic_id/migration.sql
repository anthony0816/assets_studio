/*
  Warnings:

  - Added the required column `format` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Asset" ADD COLUMN     "format" TEXT NOT NULL,
ADD COLUMN     "public_id" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `likes` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `reports` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the `categoria` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `asset_id` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ASSETS_CATEGORIAS" AS ENUM ('object', 'character', 'nature', 'city', 'surfaces', 'other');

-- AlterTable
ALTER TABLE "public"."Asset" DROP COLUMN "likes",
DROP COLUMN "reports";

-- AlterTable
ALTER TABLE "public"."Report" ADD COLUMN     "asset_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."categoria";

-- CreateTable
CREATE TABLE "public"."Like" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "asset_id" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

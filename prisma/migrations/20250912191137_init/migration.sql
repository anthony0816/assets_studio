/*
  Warnings:

  - You are about to drop the column `firebaseUid` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `user_providerId` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Asset" DROP CONSTRAINT "Asset_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Asset" DROP COLUMN "firebaseUid",
ADD COLUMN     "user_providerId" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP DEFAULT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Report" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "providerId" TEXT NOT NULL DEFAULT 'local';

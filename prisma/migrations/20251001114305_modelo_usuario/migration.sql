/*
  Warnings:

  - The values [administrador,cliente] on the enum `USER_ROLL` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `avatar` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."USER_ROLL_new" AS ENUM ('admin', 'client');
ALTER TABLE "public"."user" ALTER COLUMN "roll" DROP DEFAULT;
ALTER TABLE "public"."user" ALTER COLUMN "roll" TYPE "public"."USER_ROLL_new" USING ("roll"::text::"public"."USER_ROLL_new");
ALTER TYPE "public"."USER_ROLL" RENAME TO "USER_ROLL_old";
ALTER TYPE "public"."USER_ROLL_new" RENAME TO "USER_ROLL";
DROP TYPE "public"."USER_ROLL_old";
ALTER TABLE "public"."user" ALTER COLUMN "roll" SET DEFAULT 'client';
COMMIT;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "createdAt" TEXT NOT NULL,
ALTER COLUMN "roll" SET DEFAULT 'client';

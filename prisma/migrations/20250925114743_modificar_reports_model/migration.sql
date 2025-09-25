/*
  Warnings:

  - Added the required column `type` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."REPORT_TYPES" AS ENUM ('InappropriateContent', 'Spam', 'DataError', 'Abuse', 'Bug', 'Fraud');

-- AlterTable
ALTER TABLE "public"."Report" ADD COLUMN     "type" "public"."REPORT_TYPES" NOT NULL;

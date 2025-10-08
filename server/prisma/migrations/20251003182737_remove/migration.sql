/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."user_username_key";

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "username";

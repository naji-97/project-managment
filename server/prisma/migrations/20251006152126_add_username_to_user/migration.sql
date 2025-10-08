/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_userId_key" ON "public"."user"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

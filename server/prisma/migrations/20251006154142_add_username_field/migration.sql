/*
  Warnings:

  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "username" SET NOT NULL;

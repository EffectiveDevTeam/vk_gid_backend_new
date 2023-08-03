/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "AdminEntity" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "pass_hash" TEXT NOT NULL,
    "pass_salt" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "AdminEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminEntity_username_key" ON "AdminEntity"("username");

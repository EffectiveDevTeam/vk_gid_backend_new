/*
  Warnings:

  - The primary key for the `AdminEntity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AdminEntity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdminEntity" DROP CONSTRAINT "AdminEntity_pkey",
DROP COLUMN "id",
ADD COLUMN     "uid" SERIAL NOT NULL,
ADD CONSTRAINT "AdminEntity_pkey" PRIMARY KEY ("uid");

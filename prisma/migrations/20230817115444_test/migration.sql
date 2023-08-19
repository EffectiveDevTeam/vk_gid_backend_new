/*
  Warnings:

  - Added the required column `text` to the `TaskEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskEntity" ADD COLUMN     "text" TEXT NOT NULL;

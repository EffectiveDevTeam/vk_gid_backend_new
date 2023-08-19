/*
  Warnings:

  - You are about to drop the column `docId` on the `DirectionEntity` table. All the data in the column will be lost.
  - Added the required column `icon_name` to the `DirectionEntity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completed_byId` to the `TaskEntity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DirectionEntity" DROP CONSTRAINT "DirectionEntity_docId_fkey";

-- AlterTable
ALTER TABLE "DirectionEntity" DROP COLUMN "docId",
ADD COLUMN     "icon_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaskEntity" ADD COLUMN     "completed_byId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskEntity" ADD CONSTRAINT "TaskEntity_completed_byId_fkey" FOREIGN KEY ("completed_byId") REFERENCES "UserEntity"("vk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

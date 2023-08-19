/*
  Warnings:

  - You are about to drop the column `direction_id` on the `UserDirectionEntity` table. All the data in the column will be lost.
  - Added the required column `directionId` to the `UserDirectionEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserDirectionEntity" DROP COLUMN "direction_id",
ADD COLUMN     "directionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserDirectionEntity" ADD CONSTRAINT "UserDirectionEntity_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "DirectionEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

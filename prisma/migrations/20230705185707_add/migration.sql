-- AlterTable
ALTER TABLE "RequestSupporterEntity" ADD COLUMN     "ip" TEXT NOT NULL DEFAULT '0.0.0.0',
ADD COLUMN     "useragent" TEXT NOT NULL DEFAULT '';

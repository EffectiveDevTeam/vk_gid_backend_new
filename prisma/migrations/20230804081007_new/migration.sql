-- CreateEnum
CREATE TYPE "ProductEnum" AS ENUM ('VOICES', 'MUSIC');

-- CreateEnum
CREATE TYPE "MaterialTypeEnum" AS ENUM ('POST', 'REPORTAGE', 'CLIP', 'VIDEO', 'PODCAST');

-- CreateEnum
CREATE TYPE "DepartmentEnum" AS ENUM ('REDACTION', 'PODCASTER', 'MUSIC');

-- CreateTable
CREATE TABLE "UserEntity" (
    "vk_id" INTEGER NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,
    "registred" INTEGER NOT NULL DEFAULT 0,
    "last_seen" INTEGER NOT NULL DEFAULT 0,
    "department" "DepartmentEnum" NOT NULL,

    CONSTRAINT "UserEntity_pkey" PRIMARY KEY ("vk_id")
);

-- CreateTable
CREATE TABLE "DocumentEntity" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "is_saved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DocumentEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDirectionEntity" (
    "id" SERIAL NOT NULL,
    "direction_id" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "UserDirectionEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectionEntity" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "docId" INTEGER NOT NULL,

    CONSTRAINT "DirectionEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistredMaterialsEntity" (
    "id" SERIAL NOT NULL,
    "is_moderated" BOOLEAN NOT NULL DEFAULT false,
    "watches" INTEGER NOT NULL DEFAULT 0,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "RegistredMaterialsEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskEntity" (
    "id" SERIAL NOT NULL,
    "material_type" "MaterialTypeEnum" NOT NULL,
    "moderated_link" TEXT NOT NULL DEFAULT '',
    "is_moderated" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "TaskEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductEntity" (
    "id" SERIAL NOT NULL,
    "type" "ProductEnum" NOT NULL,
    "cost" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ProductEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEntity_vk_id_key" ON "UserEntity"("vk_id");

-- AddForeignKey
ALTER TABLE "DocumentEntity" ADD CONSTRAINT "DocumentEntity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserEntity"("vk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDirectionEntity" ADD CONSTRAINT "UserDirectionEntity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserEntity"("vk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectionEntity" ADD CONSTRAINT "DirectionEntity_docId_fkey" FOREIGN KEY ("docId") REFERENCES "DocumentEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistredMaterialsEntity" ADD CONSTRAINT "RegistredMaterialsEntity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserEntity"("vk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskEntity" ADD CONSTRAINT "TaskEntity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserEntity"("vk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "RequestSupporterEntity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "social_media" TEXT NOT NULL,
    "help_agit" BOOLEAN NOT NULL DEFAULT false,
    "help_part_life" BOOLEAN NOT NULL DEFAULT false,
    "help_friends" BOOLEAN NOT NULL DEFAULT false,
    "help_vote" BOOLEAN NOT NULL DEFAULT false,
    "help_custom" VARCHAR(200),
    "speak_out" TEXT,

    CONSTRAINT "RequestSupporterEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestSupporterEntity_phone_key" ON "RequestSupporterEntity"("phone");

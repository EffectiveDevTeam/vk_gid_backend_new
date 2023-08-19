-- CreateTable
CREATE TABLE "TasksAttachedFiles" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "TasksAttachedFiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TasksAttachedFiles" ADD CONSTRAINT "TasksAttachedFiles_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "TaskEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TasksAttachedFiles" ADD CONSTRAINT "TasksAttachedFiles_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "DocumentEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

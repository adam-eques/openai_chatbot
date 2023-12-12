/*
  Warnings:

  - You are about to drop the `Clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Threads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Clients";

-- DropTable
DROP TABLE "Threads";

-- CreateTable
CREATE TABLE "Thread" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "threadId" VARCHAR(255) NOT NULL,
    "assistantId" VARCHAR(255) NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "assistantId" VARCHAR(255) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

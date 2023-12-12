-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "assistantId" VARCHAR(255) NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

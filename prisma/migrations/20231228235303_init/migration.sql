/*
  Warnings:

  - Added the required column `atbBaseId` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atbTableNM` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atbToken` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "atbBaseId" VARCHAR(255) NOT NULL,
ADD COLUMN     "atbTableNM" VARCHAR(255) NOT NULL,
ADD COLUMN     "atbToken" VARCHAR(255) NOT NULL;

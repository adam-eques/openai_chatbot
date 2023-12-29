/*
  Warnings:

  - Added the required column `atbTableId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "atbTableId" VARCHAR(255) NOT NULL;

/*
  Warnings:

  - Added the required column `version` to the `NFTContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NFTContract` ADD COLUMN `version` VARCHAR(191) NOT NULL;

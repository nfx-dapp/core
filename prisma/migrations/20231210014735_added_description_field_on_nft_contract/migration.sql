/*
  Warnings:

  - Added the required column `description` to the `NFTContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NFTContract` ADD COLUMN `description` LONGTEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `abi` on the `NFTContract` table. All the data in the column will be lost.
  - You are about to drop the column `metadataSchema` on the `NFTContract` table. All the data in the column will be lost.
  - Added the required column `abiCID` to the `NFTContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadataSchemaCID` to the `NFTContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NFTContract` DROP COLUMN `abi`,
    DROP COLUMN `metadataSchema`,
    ADD COLUMN `abiCID` VARCHAR(191) NOT NULL,
    ADD COLUMN `metadataSchemaCID` VARCHAR(191) NOT NULL;

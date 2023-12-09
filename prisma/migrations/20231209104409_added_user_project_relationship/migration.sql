/*
  Warnings:

  - Added the required column `userAddress` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Project` ADD COLUMN `userAddress` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_userAddress_fkey` FOREIGN KEY (`userAddress`) REFERENCES `User`(`address`) ON DELETE RESTRICT ON UPDATE CASCADE;

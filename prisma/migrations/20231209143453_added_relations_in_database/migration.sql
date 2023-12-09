-- AddForeignKey
ALTER TABLE `NFTEventFilters` ADD CONSTRAINT `NFTEventFilters_contractAddress_chainId_fkey` FOREIGN KEY (`contractAddress`, `chainId`) REFERENCES `NFTContract`(`contractAddress`, `chainId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutputSchema` ADD CONSTRAINT `OutputSchema_contractAddress_chainId_fkey` FOREIGN KEY (`contractAddress`, `chainId`) REFERENCES `NFTContract`(`contractAddress`, `chainId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NFT` ADD CONSTRAINT `NFT_contractAddress_chainId_fkey` FOREIGN KEY (`contractAddress`, `chainId`) REFERENCES `NFTContract`(`contractAddress`, `chainId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NFTDataPoint` ADD CONSTRAINT `NFTDataPoint_contractAddress_chainId_tokenId_fkey` FOREIGN KEY (`contractAddress`, `chainId`, `tokenId`) REFERENCES `NFT`(`contractAddress`, `chainId`, `tokenId`) ON DELETE RESTRICT ON UPDATE CASCADE;

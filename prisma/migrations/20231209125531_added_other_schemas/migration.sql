-- CreateTable
CREATE TABLE `NFTEventFilters` (
    `contractAddress` VARCHAR(191) NOT NULL,
    `chainId` INTEGER NOT NULL,
    `eventHash` VARCHAR(191) NOT NULL,
    `eventName` VARCHAR(191) NOT NULL,
    `parameterName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`contractAddress`, `chainId`, `eventHash`, `parameterName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OutputSchema` (
    `contractAddress` VARCHAR(191) NOT NULL,
    `chainId` INTEGER NOT NULL,
    `mappingName` VARCHAR(191) NOT NULL,
    `jsonName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`contractAddress`, `chainId`, `mappingName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NFT` (
    `contractAddress` VARCHAR(191) NOT NULL,
    `chainId` INTEGER NOT NULL,
    `tokenId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`contractAddress`, `chainId`, `tokenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NFTDataPoint` (
    `contractAddress` VARCHAR(191) NOT NULL,
    `chainId` INTEGER NOT NULL,
    `tokenId` VARCHAR(191) NOT NULL,
    `blockNumber` INTEGER NOT NULL,
    `blockTimestamp` INTEGER NOT NULL,
    `traitName` VARCHAR(191) NOT NULL,
    `traitValue` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`contractAddress`, `chainId`, `tokenId`, `traitName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

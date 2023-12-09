import { Router } from "express";
import { body } from "express-validator";
import { onlyAuthorized } from "../protectionMiddlewares";
import { validate } from "../middlewares";
import { PrismaClient } from "@prisma/client";
import { uploadJSONtoIPFS } from "../helpers";
import eventListener from "../EventListener";
import { Abi } from "viem";

const router = Router();

const prisma = new PrismaClient();

router.post(
  "/",
  onlyAuthorized,
  body("name").isLength({ min: 3 }),
  body("address").isEthereumAddress(),
  body("abi").isJSON(),
  body("metadataSchema").isJSON(),
  body("version").isString(),
  body("projectSlug").isSlug(),
  body("chainId").isNumeric(),
  validate,
  async (req, res) => {
    const {
      name,
      address,
      projectSlug,
      chainId,
      abi,
      metadataSchema,
      version,
    } = req.body;

    const project = await prisma.project.findUnique({
      where: { slug: projectSlug },
    });

    if (!project) {
      res.status(404).json({ message: "project not found" });
      return;
    }

    if (
      await prisma.nFTContract.findUnique({
        where: {
          contractAddress_chainId: { contractAddress: address, chainId },
        },
      })
    ) {
      res.status(409).json({ message: "contract already created" });
      return;
    }

    const { Hash: abiCID } = await uploadJSONtoIPFS(abi);
    const { Hash: metadataSchemaCID } = await uploadJSONtoIPFS(metadataSchema);

    const nftContract = await prisma.nFTContract.create({
      data: {
        name,
        contractAddress: address,
        chainId,
        project: { connect: { slug: projectSlug } },
        abiCID,
        metadataSchemaCID,
        version,
      },
    });

    // TODO: index all nfts and their metadatas, and start the listener for the future events

    res.json({ message: "nft contract added successfully" });
  }
);

export default router;

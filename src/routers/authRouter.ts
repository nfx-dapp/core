import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, param } from "express-validator";
import {
  generateJWTToken,
  generateNonce,
  getNonceMessage,
  verifySignature,
} from "../helpers";
import { validate } from "../middlewares";

const authRouter = Router();

const prisma = new PrismaClient();

authRouter.get(
  "/nonce/:address",
  param("address").isEthereumAddress(),
  validate,
  async (req, res) => {
    const { address } = req.params;

    let user = await prisma.user.findFirst({
      where: { address },
    });

    if (!user)
      user = await prisma.user.create({
        data: {
          address,
          nonce: generateNonce(),
        },
      });

    res.json({
      message: getNonceMessage(user.nonce),
    });
  }
);

authRouter.post(
  "/login",
  body("address").isEthereumAddress(),
  body("signature").isString(),
  validate,
  async (req, res) => {
    const { address, signature } = req.body;

    const user = await prisma.user.findUnique({
      where: { address },
    });

    if (!user) return res.status(400).json({ message: "nonce not generated" });

    const isSignValid = verifySignature(
      getNonceMessage(user.nonce),
      signature,
      address
    );
    if (!isSignValid)
      return res.status(401).json({ message: "invalid signature" });

    await prisma.user.update({
      where: { address },
      data: {
        nonce: generateNonce(),
      },
    });

    const token = generateJWTToken(address);

    res.json({
      token,
    });
  }
);

export default authRouter;

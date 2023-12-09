import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middlewares";
import { PrismaClient } from "@prisma/client";
import { onlyAuthorized } from "../protectionMiddlewares";
import { CustomRequest } from "../interfaces";
import { generateSlug } from "../helpers";

const router = Router();

const prisma = new PrismaClient();

router.post(
  "/",
  onlyAuthorized,
  body("title").isLength({ min: 4 }),
  body("description").isString(),
  validate,
  async (req, res) => {
    const { title, description } = req.body;
    const { user } = req as CustomRequest;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        slug: await generateSlug(title),
        user: { connect: { address: user?.address } },
      },
    });

    res.json(project);
  }
);

export default router;

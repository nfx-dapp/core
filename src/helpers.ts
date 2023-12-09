import { ethers } from "ethers";
import { jwtSecret, nonceTemplate, lighthouseApiKey } from "./config";
import multer from "multer";
import lighthouse from "@lighthouse-web3/sdk";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const storage = multer.memoryStorage();

export const multerUploader = multer({ storage: storage });

const prisma = new PrismaClient();

export function getNonceMessage(nonce: string) {
  return nonceTemplate.replace("%", nonce);
}

// create a slug generator for the project title field where we will check it against the database and if it already exists then we will add a number to the end of it
// so for example if the title is "my project" and it already exists then the slug will be "my-project-1" and if that also exists then the slug will be "my-project-2" and so on
// we will also make sure that the slug is unique for each user so that there is no conflict between users
export async function generateSlug(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  for (let i = 0; true; i++) {
    const option = `${slug}${i ? `-${i}` : ""}`;

    const project = await prisma.project.findFirst({
      where: {
        slug: option,
      },
    });

    if (!project) return option;
  }
}

export function generateNonce() {
  const options = "ABCDEDFGHIJKLMNOPQRSTUVWXYZ";
  let nonce = "";
  for (let i = 0; i < 32; i++) {
    if (i !== 0 && i % 8 === 0) {
      nonce += "-";
    }
    nonce += options.charAt(Math.floor(Math.random() * options.length));
  }
  return nonce;
}

export function generateJWTToken(address: string) {
  return jwt.sign({ username: address }, jwtSecret);
}

export function verifyJWTToken(token: string) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    return null;
  }
}

export function verifySignature(
  data: string,
  signature: string,
  address: string
) {
  let signer;
  try {
    signer = ethers.verifyMessage(data, signature);
  } catch (err) {
    return false;
  }
  return signer.toLowerCase() === address.toLowerCase();
}

// export async function signMessage(hash: any) {
//   const signer = new ethers.Wallet(SIGNER_PRIVATE_KEY);
//   const hashBytes = ethers.arrayify(hash);
//   const signature = await signer.signMessage(hashBytes);
//   return signature;
// }

export async function uploadToIPFS(file: Express.Multer.File) {
  const res = await lighthouse.uploadBuffer(file.buffer, lighthouseApiKey);
  return res.data;
}

export async function uploadJSONtoIPFS(obj: any) {
  const res = await lighthouse.uploadBuffer(
    Buffer.from(JSON.stringify(obj), "utf-8"),
    lighthouseApiKey
  );
  return res.data as {
    Name: string;
    Hash: string;
    Size: string;
  };
}

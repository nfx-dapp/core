import express from "express";
import eventListener from "./EventListener";
import projectRouter from "./routers/projectRouter";
import nftContractRouter from "./routers/nftContractRouter";
import authRouter from "./routers/authRouter";
import { PORT } from "./config";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "The server is listening" });
});

// app.get("")

/**
 * hi we are making a platform "NFX" which is an nft explorer
 * so basically any nft developer will be able  to add their nfts to our platform by providing us an abi and metadata json
 * so in the end we will be able to showcase to other users how to interact with that nft contract
 * we will also give apis to interact with the apis based on the structure provided by the nft contract developer
 * a good use case I can tell you will be of a game developer who wants to make his game interoperable with assets from another game
 * but he obviously would not know how that particular nft works so what he will do is search for that nft on our platform by either using a name / alias or contract address and then he will be able to see the information in an easy manner and how to interact with the smart contract
 * he will also be provided our api to easily interact with the smart contract if he wants to use in game
 */

app.use("/projects", projectRouter);
app.use("/nft-contracts", nftContractRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

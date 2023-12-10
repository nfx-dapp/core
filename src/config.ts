import { createPublicClient, defineChain, webSocket, http } from "viem";

import dotenv from "dotenv";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || "";
// export const provider = new ethers.WebSocketProvider(process.env.RPC_URL || "");
export const minBlock = Number(process.env.MIN_BLOCK || "0");
// export const managerAddress = process.env.MANAGER_ADDRESS || "";
export const nonceTemplate = process.env.NONCE_TEMPLATE || "The Nonce is: %";
export const lighthouseApiKey = process.env.LIGHTHOUSE_API_KEY || "";
export const PORT = process.env.PORT || 8000;

export const mantleTestnet = /*#__PURE__*/ defineChain({
  id: 5001,
  name: "Mantle Testnet",
  network: "mantle",
  nativeCurrency: {
    decimals: 18,
    name: "MNT",
    symbol: "MNT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.mantle.xyz"],
      webSocket: ["wss://ws.testnet.mantle.xyz"],
    },
    public: {
      http: ["https://rpc.testnet.mantle.xyz"],
      webSocket: ["wss://ws.testnet.mantle.xyz"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Mantle Testnet Explorer",
      url: "https://explorer.testnet.mantle.xyz",
    },
    default: {
      name: "Mantle Testnet Explorer",
      url: "https://explorer.testnet.mantle.xyz",
    },
  },
  testnet: true,
});

export const publicClient = createPublicClient({
  chain: mantleTestnet,
  transport: http(),
});

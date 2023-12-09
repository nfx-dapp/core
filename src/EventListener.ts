import { publicClient } from "./config";
import { Abi, Log, decodeEventLog } from "viem";
import axios from "axios";

class EventListener {
  contracts: Record<
    string,
    {
      abi: Abi | readonly unknown[];
      metadataSchema: string;
      outputSchemaFields: string[];
    }
  > = {};
  refreshEvents: Record<
    string,
    { eventHash: string; eventHashName: string; fieldName: string }[]
  > = {};

  constructor() {
    publicClient.watchEvent({
      onLogs: (logs) => {
        console.log(logs);
      },
    });
  }

  addContract(
    contractAddress: string,
    data: {
      abi: Abi | readonly unknown[];
      metadataSchema: string;
      outputSchemaFields: string[];
    }
  ) {
    this.contracts[contractAddress] = data;
  }

  addContractEventHashes(
    contractAddress: string,
    refreshEvents: {
      eventHash: string;
      eventHashName: string;
      fieldName: string;
    }[]
  ) {
    if (
      !this.refreshEvents[contractAddress] ||
      this.refreshEvents[contractAddress].length == 0
    ) {
      this.refreshEvents[contractAddress] = refreshEvents;
      return;
    }

    refreshEvents.forEach((eventHash) => {
      if (!this.refreshEvents[contractAddress].includes(eventHash)) {
        this.refreshEvents[contractAddress].push(eventHash);
      }
    });
  }

  handleLog(log: Log) {
    if (!this.contracts[log.address]) return;

    const refreshEvents = this.refreshEvents[log.address].filter(
      (refreshEvent) => refreshEvent.eventHash == log.topics[0]
    );

    if (refreshEvents.length == 0) return;

    const typedLog = decodeEventLog({
      abi: this.contracts[log.address].abi,
      data: log.data,
      topics: log.topics,
    });

    for (const refreshEvent of refreshEvents) {
      const tokenId = (typedLog.args as any)[refreshEvent.fieldName].toString();
      this.refreshNft(log.address, tokenId);
    }
  }

  async refreshNft(contractAddress: `0x${string}`, tokenId: string) {
    const contract = {
      abi: this.contracts[contractAddress].abi,
      address: contractAddress,
    } as const;

    const data = await publicClient.multicall({
      contracts: [
        {
          ...contract,
          functionName: "tokenURI",
          args: [tokenId],
        },
        ...(this.contracts[contractAddress].outputSchemaFields.map((field) => ({
          ...contract,
          functionName: field,
          args: [tokenId],
        })) as any),
      ],
    });

    let outputData: Record<string, string> = {};

    let tokenUri = (data[0].result || "").toString();
    tokenUri = tokenUri.startsWith("ipfs://")
      ? `https://gateway.lighthouse.storage/ipfs/${tokenUri.slice(7)}`
      : tokenUri;
    if (tokenUri !== "") {
      outputData = await axios.get(tokenUri);
    }

    console.log(data);
  }
}

const eventListener = new EventListener();

export default eventListener;

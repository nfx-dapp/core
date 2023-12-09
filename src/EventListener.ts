import { publicClient } from "./config";
class EventListener {
  contracts: string[] = [];

  constructor() {
    publicClient.watchEvent({
      onLogs: (logs) => {
        console.log(logs);
      },
    });
  }

  addContracts(contractAddresses: string[]) {
    contractAddresses.forEach((contractAddress) => {
      if (!this.contracts.includes(contractAddress)) {
        this.contracts.push(contractAddress);
      }
    });
  }
}

const eventListener = new EventListener();

export default eventListener;

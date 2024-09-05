import ABI from "../abis/tokenABI.json";

import { ethers, formatUnits } from "ethers";
import { JsonRpcProvider, WebSocketProvider } from "ethers/providers";
import Wallet from "../models/Wallet";

export default async function getTokenHolders() {
  // Create a provider and a contract instance
  const provider = new WebSocketProvider(
    import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER
  );
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    provider
  );
  const startBlock = 6592486;
  const endBlock = await provider.getBlockNumber();

  console.log("Get Token Holders called on " + startBlock + " and " + endBlock);
  // Query the Transfer event from the contract

  const events = await contract.queryFilter("Transfer", startBlock, endBlock);

  // Create a map to store the token holders and their balances
  let holders: Set<string> = new Set();

  // Iterate over the events and update the map
  for (const event of events) {
    if ("args" in event) {
      // Get the sender and recipient of the transfer event
      const [sender, recipient] = event.args;

      // Update the balances of the sender and recipient
      holders.add(sender);
      holders.add(recipient);
    }
  }

  let wallets: Wallet[] = [];
  for (const holder of holders) {
    const balance = await contract.balanceOf(holder);
    const wallet: Wallet = {
      address: holder,
      balance: Number(formatUnits(balance, 18)),
    };

    if (wallet.balance > 0) {
      wallets.push(wallet);
    }
  }
  return wallets;
}

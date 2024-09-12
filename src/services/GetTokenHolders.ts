import ABI from "../abis/tokenABI.json";

import { ethers, formatUnits } from "ethers";
import { WebSocketProvider } from "ethers/providers";
import Wallet from "../models/Wallet";

/**
 * Retrieves the list of token holders and their balances by querying the
 * Transfer events of the contract from a given start block to the current
 * block number.
 *
 * @returns {Promise<Wallet[]>} - An array of Wallet objects with the address
 * and balance of each token holder.
 */
export default async function getTokenHolders(): Promise<Wallet[]> {
  const provider = new WebSocketProvider(
    import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER
  );
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    provider
  );
  if (
    !import.meta.env.VITE_CONTRACT_ADDRESS ||
    !import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER
  ) {
    throw new Error("Contract address or RPC provider not set");
  }
  // Create a provider and a contract instance

  // Define the start block number from which to query the Transfer events
  const startBlock = 6592486;

  // Get the current block number
  const endBlock = await provider.getBlockNumber();

  // Query the Transfer event from the contract
  const events = await contract.queryFilter(
    "Transfer",
    startBlock,
    endBlock - 50000
  );

  const additionalEvents = await contract.queryFilter(
    "Transfer",
    endBlock - 50000,
    endBlock
  );

  // Create a map to store the token holders and their balances
  const holders: Set<string> = new Set();

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
  for (const event of additionalEvents) {
    if ("args" in event) {
      // Get the sender and recipient of the transfer event
      const [sender, recipient] = event.args;

      // Update the balances of the sender and recipient
      holders.add(sender);
      holders.add(recipient);
    }
  }

  // Create an array to store the Wallet objects
  const wallets: Wallet[] = [];

  // Iterate over the holders and create a Wallet object for each one
  for (const holder of holders) {
    const balance = await contract.balanceOf(holder);
    const wallet: Wallet = {
      address: holder,
      balance: Number(formatUnits(balance, 18)),
    };

    // Only add the wallet to the array if it has a balance greater than 0
    if (wallet.balance > 0) {
      wallets.push(wallet);
    }
  }
  console.log("Wallets:", wallets);
  return wallets;
}

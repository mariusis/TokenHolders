import ABI from "../abis/tokenABI.json";

import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers/providers";

/**
 * Fetches the list of token holders from the blockchain and returns
 * an array of tuples, where the first element of each tuple is the
 * address of the token holder and the second element is the balance
 * of the token holder.
 *
 * @returns {Promise<[string, bigint][]}}
 */
export default async function getTokenHolders(): Promise<[string, bigint][]> {
  // Create a provider and a contract instance
  const provider = new JsonRpcProvider(import.meta.env.VITE_JSON_RPC_PROVIDER);
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    provider
  );

  // Query the Transfer event from the contract
  const startBlock = 6592486;
  const endBlock = await provider.getBlockNumber();

  const events = await contract.queryFilter("Transfer", startBlock, endBlock);

  // Create a map to store the token holders and their balances
  const wallets: Map<string, bigint> = new Map();

  // Iterate over the events and update the map
  for (const event of events) {
    if ("args" in event) {
      // Get the sender and recipient of the transfer event
      const [sender, recipient, amount] = event.args;

      // Update the balances of the sender and recipient
      wallets.set(sender, (wallets.get(sender) || 0n) - amount);
      wallets.set(recipient, (wallets.get(recipient) || 0n) + amount);
    }
  }

  // Return the list of token holders and their balances, excluding those with a balance of 0
  return Array.from(wallets).filter(([_, balance]) => balance > 0n);
}

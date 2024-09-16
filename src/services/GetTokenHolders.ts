import Wallet from "../models/Wallet";
import WebSocketSingleton from "../utils/WebSocketSingleton";
import ContractSingleton from "../utils/ContractSingleton";
import { formatUnits } from "ethers";

/**
 * Retrieves the list of token holders and their balances by querying the
 * Transfer events of the contract from a given start block to the current
 * block number.
 *
 * @returns {Promise<Wallet[]>} - An array of Wallet objects with the address
 * and balance of each token holder.
 */
export default async function getTokenHolders(): Promise<Wallet[]> {
  const provider = WebSocketSingleton.getInstance();
  const contract = ContractSingleton.getInstance();
  // Create a provider and a contract instance

  // Define the start block number from which to query the Transfer events
  const startBlock = 6592486;

  // Get the current block number
  const endBlock = await provider.getBlockNumber();

  // Query the Transfer event from the contract
  const events = await contract.queryFilter(
    "Transfer",
    startBlock,
    startBlock + 49999
  );

  const additionalEvents = await contract.queryFilter(
    "Transfer",
    startBlock + 50000,
    startBlock + 99999
  );
  const additionalEvents2 = await contract.queryFilter(
    "Transfer",
    startBlock + 100000,
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
  for (const event of additionalEvents2) {
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

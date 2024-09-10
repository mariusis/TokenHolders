import { ethers, formatUnits } from "ethers";
import ABI from "../abis/tokenABI.json";
import db from "../lib/dexie.config";
import { WebSocketProvider } from "ethers";

let contract: ethers.Contract;

/**
 * Start listening to the Transfer event on the contract and update the
 * token balances in the database when a transfer occurs.
 */
export default async function startTransferEventListener() {
  // Create a WebSocket provider and a contract instance
  try {
    const provider = new WebSocketProvider(
      import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER
    );
    contract = new ethers.Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      ABI,
      provider
    );

    if(
      !import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER || !import.meta.env.VITE_CONTRACT_ADDRESS){
        throw new Error('There is a problem with the provider / contract address configuration');
      }

    
    // Set up an event listener for the Transfer event
    contract.on("Transfer", async (from, to) => {
      // Get the current balances of the sender and recipient
      const fromBalance = await contract.balanceOf(from);
      const toBalance = await contract.balanceOf(to);

      // Update the balances in the database
      await updateTokenHolder(from, formatUnits(fromBalance, 18));
      await updateTokenHolder(to, formatUnits(toBalance, 18));
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Update the token balance of a holder in the database.
 * If the holder doesn't exist, create a new one.
 * If the balance is 0, delete the holder from the database.
 * @param {string} address - The address of the token holder.
 * @param {string} balance - The new balance of the token holder, in units of 10^18.
 * @returns {Promise<void>}
 */
async function updateTokenHolder(address: string, balance: string) {
  // Get the current record from the database
  try {
    const existingHolder = await db
      .table("tokenHolders")
      .get({ address: address });

    if (existingHolder) {
      // Update the record in the database
      await db.table("tokenHolders").update(address, { balance: balance });
    } else {
      // Create a new record in the database
      await db.table("tokenHolders").add({ address, balance });
    }

    // Remove the token holder if they have a balance of 0
    if (Number(balance) <= 0) {
      // Delete the record from the database
      await db.table("tokenHolders").where("address").equals(address).delete();
    }
  } catch (error) {
    throw error;
  }
}

export function stopTransferEventListener() {
  // Ensure contract exists and remove the event listener
  if (contract) {
    contract.off("Transfer"); // Removes all listeners for "Transfer"
  }
}

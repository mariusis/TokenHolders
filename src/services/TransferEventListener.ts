import { formatUnits } from "ethers";
import db from "../lib/dexie.config";

import EventEmitter from "../utils/EventEmitter";
import ContractSingleton from "../utils/ContractSingleton";

export const eventEmmiter = new EventEmitter();

/**
 * Start listening to the "Transfer" event of the contract.
 * When the event is emitted, it updates the balances of the sender and the recipient
 * in the Dexie database and emits an event with the updated balances.
 */
export default async function startTransferEventListener(): Promise<void> {
  const contract = ContractSingleton.getInstance();

  contract.on("Transfer", async (from: string, to: string) => {
    // Get the balances of the sender and the recipient
    const fromBalance = await contract.balanceOf(from);
    const toBalance = await contract.balanceOf(to);

    // Update the balances in the Dexie database
    await updateTokenHolder(from, formatUnits(fromBalance, 18));
    await updateTokenHolder(to, formatUnits(toBalance, 18));

    // Emit an event with the updated balances
    eventEmmiter.emit("transfer", { from, to });
  });
}

/**
 * Updates the balance of a token holder in the Dexie database.
 * If the token holder does not exist, it is added.
 * If the balance is 0, the token holder is removed.
 * @param {string} address - The wallet address of the token holder.
 * @param {string} balance - The balance of the token holder, as a string.
 */
async function updateTokenHolder(
  address: string,
  balance: string
): Promise<void> {
  const existingHolder = await db
    .table("tokenHolders")
    .get({ address: address });

  if (existingHolder) {
    // Update the balance of the token holder
    await db.table("tokenHolders").update(address, { balance: balance });
  } else {
    // Add the token holder to the database
    await db.table("tokenHolders").add({ address, balance });
  }

  // Remove the token holder if they have a balance of 0
  if (Number(balance) <= 0) {
    // Remove the token holder from the database
    await db.table("tokenHolders").where("address").equals(address).delete();
  }
}

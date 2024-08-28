import Dexie, { Table } from "dexie";
import Wallet from "../models/TokenHolderModel";
// Define the interface for a wallet

// Extend Dexie with your database schema
class TokenHolderDatabase extends Dexie {
  wallets!: Table<Wallet>; // Define the wallets table

  constructor() {
    super("TokenHolderDatabase");
    this.version(1).stores({
      wallets: "++id, address, balance",
    });
  }
}

// Create an instance of the database
const db = new TokenHolderDatabase();

// Add wallet data
export async function addTokenHolder(
  address: string,
  balance: number
): Promise<void> {
  await db.wallets.add({ address, balance });
}

// Get wallet data
export async function getTokenHolders(): Promise<Wallet[]> {
  return await db.wallets.toArray();
}

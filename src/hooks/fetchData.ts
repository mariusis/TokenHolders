import { JsonRpcProvider } from "ethers";
import db from "../lib/dexie.config";
import getTokenHolders from "../services/TokenHolders";

let startBlock = 6592486; // Global variable
let isTrue = true;

export default async function fetchData(): Promise<any[]> {
  const provider = new JsonRpcProvider(import.meta.env.VITE_JSON_RPC_PROVIDER);

  try {
    if (startBlock > 6592486) {
      const endBlock = (await provider.getBlockNumber()) - 1;
      if (startBlock < endBlock - 1) {
        const data = await getTokenHolders(startBlock, endBlock);
        console.log(data);
        startBlock = endBlock + 1;
        if (data && Array.isArray(data)) {
          db.table("tokenHolders").bulkAdd(data);
        }
      }

      console.log("Data fetched from first code block");
    }

    let result = await db.table("tokenHolders").toArray();
    // Fetch the current records

    // If the result is empty, fetch new data and add it
    if (result.length === 0) {
      const endBlock = (await provider.getBlockNumber()) - 1;

      const data = await getTokenHolders(startBlock, endBlock);
      startBlock = endBlock + 1;
      if (data && Array.isArray(data) && isTrue) {
        db.table("tokenHolders").bulkAdd(data);
        isTrue = false;
      }

      console.log("Data fetched from second code block");
    }
    result = await db.table("tokenHolders").toArray();

    return result || []; // Ensure it returns an array, even if empty
  } catch (error) {
    console.error("Error in fetchData:", error);
    return []; // Return an empty array on error
  }
}

import db from "../lib/dexie.config";
import getTokenHolders from "../services/GetTokenHolders";

export default async function fetchData(): Promise<void> {
  let result = await db.table("tokenHolders").toArray();
  // Fetch the current records

  // If the result is empty, fetch new data and add it
  if (result.length == 0) {
    console.log("Data Initialized because result is :", result);

    try {
      const data = await getTokenHolders();

      for (const holder of data) {
        db.table("tokenHolders").add({
          address: holder.address,
          balance: holder.balance,
        });
      }
    } catch (error) {
      throw error;
    }
  }
}

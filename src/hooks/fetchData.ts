import db from "../lib/dexie.config";
import getTokenHolders from "../services/GetTokenHolders";

let count = 0;

export default async function fetchData(): Promise<void> {
  try {
    let result = await db.table("tokenHolders").toArray();
    // Fetch the current records
    console.log("fetchData called on " + count++);
    // If the result is empty, fetch new data and add it
    if (result.length == 0) {
      console.log("Data Initialized because result is :", result);

      const data = await getTokenHolders();

      for (const holder of data) {
        db.table("tokenHolders").add({
          address: holder.address,
          balance: holder.balance,
        });
      }
    }
  } catch (error) {
    console.error("Error in fetchData:", error);
  }
}

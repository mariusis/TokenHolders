import db from "../lib/dexie.config";
import getTokenHolders from "../services/TokenHolders";

export default async function fetchData(
  clearCache: boolean = false
): Promise<any[]> {
  try {
    if (clearCache) {
      // Clear all records in the table
      await db.table("tokenHolders").clear();
    }

    // Fetch the current records
    let result = await db.table("tokenHolders").toArray();

    // If the result is empty, fetch new data and add it
    if (result.length === 0) {
      const data = await getTokenHolders();
      if (data && Array.isArray(data)) {
        await db.table("tokenHolders").bulkAdd(data);
        result = data; // Update the result with the newly added data
      }
    }

    return result || []; // Ensure it returns an array, even if empty
  } catch (error) {
    console.error("Error in fetchData:", error);
    return []; // Return an empty array on error
  }
}

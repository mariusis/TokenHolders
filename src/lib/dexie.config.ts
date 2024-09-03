import Dexie from "dexie";

const db = new Dexie("MyCacheDB");
db.version(1).stores({
  tokenHolders: "++id, *tokenHolder",
  // Add more stores as needed
});

export default db;

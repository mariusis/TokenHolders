import Dexie from "dexie";

const db = new Dexie("MyCacheDB");
db.version(1).stores({
  tokenHolders: "address, balance",
});

export default db;

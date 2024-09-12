import { ethers, formatUnits } from "ethers";
import ABI from "../abis/tokenABI.json";
import db from "../lib/dexie.config";
import { WebSocketProvider } from "ethers";
import EventEmitter from "../utils/EventEmitter";

export const eventEmmiter = new EventEmitter();

export default async function startTransferEventListener() {
  const provider = new WebSocketProvider(
    import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER
  );
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    provider
  );
  if (
    !import.meta.env.VITE_CONTRACT_ADDRESS ||
    !import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER
  ) {
    throw new Error("Contract address or RPC provider not set");
  }
  contract.on("Transfer", async (from, to) => {
    const fromBalance = await contract.balanceOf(from);
    const toBalance = await contract.balanceOf(to);

    // Update from and to balances
    await updateTokenHolder(from, formatUnits(fromBalance, 18));
    await updateTokenHolder(to, formatUnits(toBalance, 18));
    eventEmmiter.emit("transfer", { from, to });
  });
}

async function updateTokenHolder(address: string, balance: string) {
  const existingHolder = await db
    .table("tokenHolders")
    .get({ address: address });

  if (existingHolder) {
    await db.table("tokenHolders").update(address, { balance: balance });
  } else {
    await db.table("tokenHolders").add({ address, balance });
  }

  // Remove the token holder if they have a balance of 0
  if (Number(balance) <= 0) {
    await db.table("tokenHolders").where("address").equals(address).delete();
  }
}

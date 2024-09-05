import { ethers, formatUnits } from "ethers";
import ABI from "../abis/tokenABI.json";
import db from "../lib/dexie.config";
import { WebSocketProvider } from "ethers";

export default async function startTransferEventListener() {
  const provider = new WebSocketProvider(
    import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER
  );
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    provider
  );

  contract.on("Transfer", async (sender, recipient) => {
    const senderBalance = await contract.balanceOf(sender);
    const recipientBalance = await contract.balanceOf(recipient);

    // Update sender and recipient balances
    await updateTokenHolder(sender, formatUnits(senderBalance, 18));
    await updateTokenHolder(recipient, formatUnits(recipientBalance, 18));
  });
}

async function updateTokenHolder(address: string, balance: string) {
  const existingHolder = await db.table("tokenHolders").get(address);

  if (existingHolder) {
    await db.table("tokenHolders").update(address, { balance });
  } else {
    await db.table("tokenHolders").add({ address, balance });
  }

  // Remove the token holder if they have a balance of 0
  if (Number(balance) <= 0) {
    await db.table("tokenHolders").where("address").equals(address).delete();
  }
}

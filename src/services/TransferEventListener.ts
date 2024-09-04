import { ethers, formatUnits, JsonRpcProvider } from "ethers";
import ABI from "../abis/tokenABI.json";
import db from "../lib/dexie.config";
import { debounce } from "lodash";

// Define the type for the parameters of the debounced function
type TransferEventParams = {
  from: string;
  to: string;
  value: bigint; // Use bigint here
  event: any; // Using `any` for the event, or you can define a more specific type if needed
};

const handleTransferEvent = debounce(
  async (params: TransferEventParams, contract: ethers.Contract) => {
    const { to } = params;
    const { from } = params;

    try {
      // Fetch the balance for the recipient address
      const balanceTo = await contract.balanceOf(to);
      if (
        (await db.table("tokenHolders").where("address").equals(to).count()) ===
        0
      ) {
        await db.table("tokenHolders").add({
          address: to,
          balance: formatUnits(balanceTo, 18),
        });
      } else {
        await db
          .table("tokenHolders")
          .where("address")
          .equals(to)
          .modify({ balance: formatUnits(balanceTo, 18) });
      }

      const balanceFrom = await contract.balanceOf(from);
      if (
        (await db
          .table("tokenHolders")
          .where("address")
          .equals(from)
          .count()) === 0
      ) {
        await db.table("tokenHolders").add({
          address: from,
          balance: formatUnits(balanceFrom, 18),
        });
      } else {
        if ((await balanceFrom) == 0) {
          await db.table("tokenHolders").where("address").equals(from).delete();
        } else {
          await db
            .table("tokenHolders")
            .where("address")
            .equals(from)
            .modify({ balance: formatUnits(balanceFrom, 18) });
        }
      }
    } catch (error) {
      console.error("Error updating token holder data:", error);
    }
  },
  500 // Adjust the debounce delay (in milliseconds) as needed
);

// Maintain a reference to the listener function
let transferListener: ethers.Listener | null = null;

export default async function TransferEventListener() {
  const provider = new JsonRpcProvider(import.meta.env.VITE_JSON_RPC_PROVIDER);
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    provider
  );

  // Define the event listener function
  const onTransfer = (from: string, to: string, value: bigint, event: any) => {
    handleTransferEvent({ from, to, value, event }, contract);
  };

  // Add the event listener
  contract.on("Transfer", onTransfer);

  // Store the listener for potential removal later
  transferListener = onTransfer;

  // Return a function to remove the event listener
  return () => {
    if (transferListener) {
      contract.off("Transfer", transferListener);
      transferListener = null;
    }
  };
}

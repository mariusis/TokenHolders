import ABI from "../abis/tokenABI.json";

import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers/providers";

const provider = new JsonRpcProvider(import.meta.env.VITE_JSON_RPC_PROVIDER);

export default async function getTokenHolders(): Promise<[string, bigint][]> {
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    provider
  );

  const startBlock = 6592486;
  const endBlock = await provider.getBlockNumber();

  const events = await contract.queryFilter("Transfer", startBlock, endBlock);

  const wallets: Map<string, bigint> = new Map();

  for (const event of events) {
    if ("args" in event) {
      const [sender, recipient] = event.args;

      wallets.set(sender, 0n);
      wallets.set(recipient, 0n);
    }
  }

  for (const [address] of wallets) {
    const balance = await contract.balanceOf(address);
    wallets.set(address, balance);
  }

  return Array.from(wallets).filter(([_, balance]) => balance > 0n);
}

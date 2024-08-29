import ABI from "../abis/tokenABI.json";

import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers/providers";

const CONTRACT_ADDRESS = "0xb1EA3b0211bee07388937Ae6Bdf2537c62DD6B92";
const START_BLOCK = 6592486;

const provider = new JsonRpcProvider(
  "https://ethereum-sepolia-rpc.publicnode.com"
);
const END_BLOCK = await provider.getBlockNumber();

export default async function getAllTransactionsForContract() {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  const events = await contract.queryFilter("Transfer", START_BLOCK, END_BLOCK);

  const map: Map<string, BigInt> = new Map<string, BigInt>();

  for (const event of events) {
    if ("args" in event) {
      // type guard

      const balance = await contract.balanceOf(event.args[0]);
      const balance2 = await contract.balanceOf(event.args[1]);

      if (balance > 0) {
        map.set(event.args[0], balance);
      } else {
        map.delete(event.args[0]);
      }
      if (balance2 > 0) {
        map.set(event.args[1], balance2);
      } else {
        map.delete(event.args[1]);
      }
    }
  }

  return Array.from(map.entries());
}

export async function getAllHolders() {
  for (let blockNumber = START_BLOCK; blockNumber < END_BLOCK; blockNumber++) {
    const block = await provider.getBlock(blockNumber);
    if (block) {
      const transactionHashes = await block.transactions;

      for (const transactionHash of transactionHashes) {
        const transaction = await provider.getTransaction(transactionHash);
        console.log(transaction);
      }
    }
  }
}

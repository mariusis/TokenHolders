import ABI from "../abis/tokenABI.json";

import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers/providers";

const CONTRACT_ADDRESS = "0xb1EA3b0211bee07388937Ae6Bdf2537c62DD6B92";
const START_BLOCK = 6592486;

const provider = new JsonRpcProvider(
  "https://ethereum-sepolia-rpc.publicnode.com"
);

export default async function getAllTransactionsForContract() {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider); //Get an istance of the contract
  const END_BLOCK = await provider.getBlockNumber(); //Get the latest block of the provider
  const events = await contract.queryFilter("Transfer", START_BLOCK, END_BLOCK); //Search for all transfer events between the first block the contract appears and the latest

  const map: Map<string, BigInt> = new Map<string, BigInt>(); //Map to store the wallets and their balances

  for (const event of events) {
    if ("args" in event) {
      // type guard, event might be of type Log or EventLog

      //Get token balance of the wallets that are parts of the transfer
      const balance = await contract.balanceOf(event.args[0]);
      const balance2 = await contract.balanceOf(event.args[1]);

      //Add / Update the wallet into the map or delete the entry if balance is 0 for transfer sender
      if (balance > 0) {
        map.set(event.args[0], balance);
      } else {
        map.delete(event.args[0]);
      }

      //Add / Update the wallet into the map or delete the entry if balance is 0 for transfer receiver

      if (balance2 > 0) {
        map.set(event.args[1], balance2);
      } else {
        map.delete(event.args[1]);
      }
    }
  }

  //Return the map as an array
  return Array.from(map.entries());
}

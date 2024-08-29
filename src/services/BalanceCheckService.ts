import ABI from "../abis/tokenABI.json";

import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers/providers";

const CONTRACT_ADDRESS = "0xb1EA3b0211bee07388937Ae6Bdf2537c62DD6B92";

const provider = new JsonRpcProvider(
  "https://ethereum-sepolia-rpc.publicnode.com"
);

export default async function checkUserBalance(userWallet: string) {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  const balance = await contract.balanceOf(userWallet);

  return balance;
}

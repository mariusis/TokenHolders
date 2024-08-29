import ABI from "../abis/tokenABI.json";

import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers/providers";

const provider = new JsonRpcProvider(import.meta.env.VITE_JSON_RPC_PROVIDER);

export default async function checkUserBalance(address: string) {
  //Intitialize the contract
  const contract = new ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    provider
  );

  const balance = await contract.balanceOf(address); //Call to the balanceOf() method of the contract to get the balance of the address

  return balance;
}

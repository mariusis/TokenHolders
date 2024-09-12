import ABI from "../abis/tokenABI.json";

import { ethers } from "ethers";

import WebSocketSingleton from "../utils/WebSocketSingleton";

/**
 * Calls the balanceOf() method of the contract to get the balance of the address.
 * @param {string} address - The wallet address to check the balance of.
 * @returns {Promise<BigNumber>} - The balance of the address.
 */

export default async function checkUserBalance(address: string) {
  //Intitialize the contract
  const provider = WebSocketSingleton.getInstance();
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

  const balance = await contract.balanceOf(address); //Call to the balanceOf() method of the contract to get the balance of the address

  return balance;
}

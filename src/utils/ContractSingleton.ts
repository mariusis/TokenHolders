import { ethers } from "ethers";
import WebSocketSingleton from "./WebSocketSingleton";
import ABI from "../abis/tokenABI.json";

class ContractSingleton {
  private static instance: ethers.Contract | null = null;

  private constructor() {}

  public static getInstance(): ethers.Contract {
    if (!this.instance) {
      if (!import.meta.env.VITE_CONTRACT_ADDRESS) {
        throw new Error("WebSocket RPC provider not set");
      }
      const provider = WebSocketSingleton.getInstance();
      this.instance = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        ABI,
        provider
      );
    }
    return this.instance;
  }
}

export default ContractSingleton;

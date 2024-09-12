import { ethers } from "ethers";

class WebSocketSingleton {
  private static instance: ethers.WebSocketProvider | null = null;

  private constructor() {}

  public static getInstance(): ethers.WebSocketProvider {
    if (!this.instance) {
      if (!import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER) {
        throw new Error("WebSocket RPC provider not set");
      }
      this.instance = new ethers.WebSocketProvider(
        import.meta.env.VITE_WEBSOCKET_RPC_PROVIDER
      );
    }
    return this.instance;
  }
}

export default WebSocketSingleton;

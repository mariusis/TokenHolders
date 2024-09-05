import { useEffect, useState } from "react";

import fetchData from "../hooks/fetchData";
import Wallet from "../models/Wallet";
import TransferEventListener, {
  stopTransferEventListener,
} from "../services/TransferEventListener";
import db from "../lib/dexie.config";
import { Button } from "flowbite-react";

const TokenInfoDisplay = () => {
  const [tokenHolders, setTokenHolders] = useState(0);

  useEffect(() => {
    // Initialize the data
    fetchData();

    const intervalId = setInterval(fetchData, 10000); // Set the interval to update the data every 1 second

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Initialize the transfer event listener when the component mounts
    TransferEventListener();
    return () => {
      stopTransferEventListener();
    };
  }, []);

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      console.log("Updating data...");
      try {
        const data: Wallet[] = await db.table("tokenHolders").toArray(); //Get the cached data from dexie

        setTokenHolders(data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndUpdate();

    const intervalId = setInterval(fetchDataAndUpdate, 1000); // Set the interval to update the data every 1 second

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {/* Sepolia redirect button */}
      <div className="flex justify-center">
        <a
          href={`https://sepolia.etherscan.io/address/0xb1EA3b0211bee07388937Ae6Bdf2537c62DD6B92`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button color="blue" className="mt-4">
            Etherscan Link
          </Button>
        </a>
      </div>
      <div className="flex h-[calc(100vh-15rem)] items-center">
        {/* Token holders number message */}
        <div className="w-fit flex flex-col items-center text-center mx-auto p-20 my-4 bg-gray-100 rounded-[50%] shadow-md">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Token Holders
          </h2>
          <p className="text-2xl text-gray-600">There are currently</p>
          <p className="text-5xl font-bold text-gray-900">
            {tokenHolders > 0 ? tokenHolders : <span>&nbsp;</span>}
          </p>
          <p className="text-2xl text-gray-600">wallets owning this token</p>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoDisplay;

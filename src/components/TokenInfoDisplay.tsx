import { useEffect, useState } from "react";

import logo from "../assets/logo.jpg";

import fetchData from "../hooks/InitializeTransferData";
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

    const intervalId = setInterval(fetchData, 10000); // Set the interval to update the data every 10 second

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
    <div className="w-full h-[100vh] flex flex-col items-center">
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

      {/* Token holders number message */}
      <div className="relative">
        <div
          className="aspect-square min-w-[500px] text-center flex flex-col justify-evenly items-center rounded-3xl p-10 mt-4 bg-image "
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: "cover",
            opacity: 0.6,
          }}
        ></div>
        <div className="h-fit w-full absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]  text-center">
          <p className=" text-2xl  font-bold text-blue-950">
            There are currently
          </p>
          <p className=" text-4xl font-bold text-blue-950">
            {tokenHolders > 0 ? tokenHolders : <span>&nbsp;</span>}
          </p>
          <p className=" text-2xl font-bold text-blue-950">
            wallets owning this token
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoDisplay;

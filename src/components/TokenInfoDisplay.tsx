import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

import BalanceCheckForm from "./BalanceCheckForm";

import fetchData from "../hooks/fetchData";
import Wallet from "../models/Wallet";
import TransferEventListener from "../services/TransferEventListener";
import db from "../lib/dexie.config";

const TokenInfoDisplay = () => {
  const [tokenHolders, setTokenHolders] = useState(0);
  const [wallets, setWallets] = useState([] as Wallet[]);

  library.add(faCopy);

  useEffect(() => {
    // Initialize the transfer event listener when the component mounts
    TransferEventListener();
  }, []);

  useEffect(() => {
    const InitializeData = async () => {
      try {
        // Clear cache and fetch new data
        const data: Wallet[] = await fetchData();

        setTokenHolders(data.length);
        setWallets(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Initial fetch
    InitializeData();

    const intervalId = setInterval(InitializeData, 10000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      try {
        // Clear cache and fetch new data
        const data: Wallet[] = await db.table("tokenHolders").toArray();

        setTokenHolders(data.length);
        setWallets(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndUpdate();

    const intervalId = setInterval(fetchDataAndUpdate, 100);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {/* Sepolia redirect button */}

      <div>
        <a
          href={`https://sepolia.etherscan.io/address/0xb1EA3b0211bee07388937Ae6Bdf2537c62DD6B92`}
        >
          <button
            className="w-fit p-2 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-lg"
            type="submit"
          >
            Etherscan Link
          </button>
        </a>
      </div>

      {/* Token holders number message */}

      <div className="flex flex-col items-center text-3xl text-white mx-auto p-4 ">
        <p>There are currently </p>
        {tokenHolders > 0 ? <p> {tokenHolders} </p> : <p>&ensp;</p>}
        <p>wallets owning this token</p>
      </div>

      <BalanceCheckForm />

      {/* Wallets table */}

      <h1 className="text-3xl text-white font-bold my-3">Wallets</h1>
      <div className="bg-white w-fit mx-auto rounded-[2rem] shadow-md">
        <div className="grid grid-cols-[2fr_1fr] gap-4 p-4">
          <div className="text-gray-500 font-bold">Address</div>
          <div className="text-gray-500 font-bold">Balance</div>
        </div>
        {wallets.map((wallet, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr] gap-4 p-4 hover:bg-gray-100"
          >
            <div className="flex items-center justify-evenly gap-2">
              <a
                href={`https://sepolia.etherscan.io/address/${wallet.address}`}
                target="_blank"
                className="text-blue-500 hover:text-blue-700 overflow-hidden text-overflow-ellipsis whitespace-nowrap max-w-[150px] sm:max-w-none"
              >
                {wallet.address}
              </a>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => navigator.clipboard.writeText(wallet.address)}
              >
                <FontAwesomeIcon icon={["far", "copy"]} />
              </button>
            </div>

            <div>{wallet.balance}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenInfoDisplay;

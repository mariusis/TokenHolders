import { useEffect, useState } from "react";
import getTokenHolders from "../services/TokenHolders";

import { formatUnits } from "@ethersproject/units";
import BalanceCheckForm from "./BalanceCheckForm";

const TokenInfoDisplay = () => {
  const [tokenHolders, setTokenHolders] = useState(0);
  const [wallets, setWallets] = useState<[string, any][]>([]); // Conflicting type for BigInt -- Replaced with any

  useEffect(() => {
    /**
     * Fetches the token holders from the blockchain and updates the component state
     * with the result.
     * @returns {Promise<void>}
     */
    const fetchData = async (): Promise<void> => {
      try {
        // Fetch the list of token holders from the blockchain
        const data = await getTokenHolders();

        // Set the token holders count in the component state
        setTokenHolders(data.length);

        // Set the wallets list in the component state
        setWallets(data);
      } catch (error) {
        // Log any errors to the console
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Sepolia redirect button */}

      <div>
        <a
          href={`https://sepolia.etherscan.io/address/0xb1EA3b0211bee07388937Ae6Bdf2537c62DD6B92`}
        >
          <button
            className="w-fit p-2  bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded-lg"
            type="submit"
          >
            Etherscan Link
          </button>
        </a>
      </div>

      {/* Token holders number message */}

      <div className="flex flex-col items-center text-3xl mx-auto p-4 my-4 ">
        <p>There are currently </p>
        <p>{tokenHolders}</p>
        <p>wallets owning this token</p>
      </div>

      <BalanceCheckForm />

      {/* Wallets table */}

      <h1 className="text-3xl font-bold my-3">Wallets</h1>
      <div className="">
        <table className="d-flex w-full mx-auto border-collapse border-4 border-gray-400">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 p-2">Address</th>
              <th className="border border-gray-400 p-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 hover:text-blue-500 max-w-[150px] sm:max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                  <a
                    href={`https://sepolia.etherscan.io/address/${wallet[0]}`}
                    target="_blank"
                  >
                    {wallet[0]}
                  </a>
                </td>
                <td className="border border-gray-400 p-2">
                  {formatUnits(wallet[1], 18)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenInfoDisplay;

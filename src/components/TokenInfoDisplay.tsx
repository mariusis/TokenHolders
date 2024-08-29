import { useEffect, useState } from "react";
import getAllTransactionsForContract from "../services/TokenHolders";

import { formatUnits } from "@ethersproject/units";
import BalanceCheckForm from "./BalanceCheckForm";

const TokenInfoDisplay = () => {
  const [tokenHolders, setTokenHolders] = useState(0);
  const [wallets, setWallets] = useState<[string, any][]>([]); // Conflicting type for BigInt -- Replaced with any

  // Alternative to getAllTransactionsForContract(), not fully implemented yet
  // getAllHolders();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllTransactionsForContract();
        setTokenHolders(data.length); // Set the number of token holders
        setWallets(data); // Set the wallet data
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <div>
          <h1> Contract Address: </h1>
          <a
            href={`https://sepolia.etherscan.io/address/0xb1EA3b0211bee07388937Ae6Bdf2537c62DD6B92`}
          >
            <button
              className="w-fit p-2 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              type="submit"
            >
              Sepolia Etherscan
            </button>
          </a>
        </div>

        <div className="text-3xl   w-fit mx-auto my-3">
          <p>Total number of holders:</p>
          <p>{tokenHolders}</p>
        </div>
        <BalanceCheckForm />
        <h1 className="text-3xl font-bold my-3">Wallets</h1>
        <table className="w-1/2 mx-auto border-collapse border-4  border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2">Address</th>
              <th className="border border-gray-400 p-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 hover:text-blue-500">
                  <a
                    href={`https://sepolia.etherscan.io/address/${wallet[0]}`}
                    target="_blank"
                  >
                    {wallet[0]}
                  </a>
                </td>
                <td className="border border-gray-400 p-2">
                  Balance: {formatUnits(wallet[1], 18)}
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

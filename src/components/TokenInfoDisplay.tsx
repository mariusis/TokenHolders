import { useEffect, useState } from "react";
import getAllTransactionsForContract from "../hooks/TokenHolders";

import { formatUnits } from "@ethersproject/units";

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
        <div className="text-3xl   w-fit mx-auto my-3">
          <p>Total number of holders:</p>
          <p>{tokenHolders}</p>
        </div>
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
                <td className="border border-gray-400 p-2">{wallet[0]}</td>
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

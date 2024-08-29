import React, { useState } from "react";
import checkUserBalance from "../services/BalanceCheckService";
import { formatUnits } from "@ethersproject/units";
const BalanceCheckForm = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Get the address token balance, convert it from BigInt and moving the decimal points then set the state
    checkUserBalance(address).then((balance) => {
      setBalance(Number(formatUnits(balance, 18)));
    });
  };

  return (
    <form
      className="flex flex-col items-center max-w-md mx-auto p-4 mt-2  bg-gray-100 rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <label className="text-lg font-medium mb-2">
        Enter your wallet address:
      </label>
      <input
        className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={address}
        onChange={(event) => {
          setAddress(event.target.value);
          setBalance(0);
        }}
      />
      <button
        className="w-full p-2 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        type="submit"
      >
        Check Balance
      </button>
      {balance > 0 && (
        <p className="text-lg font-medium mt-4 text-gray-600">
          Your balance is: {balance} MTK
        </p>
      )}
    </form>
  );
};

export default BalanceCheckForm;

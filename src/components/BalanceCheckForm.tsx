import React, { useState } from "react";
import checkUserBalance from "../services/BalanceCheckService";
import { formatUnits } from "@ethersproject/units";
const BalanceCheckForm = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  /**
   * Handles the form submission by getting the token balance of the
   * provided address, converting it from BigInt to a number with 18
   * decimal places, and setting the component state with the result.
   * If an error is encountered, it is logged to the console.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Call the checkUserBalance() function to get the token balance of the
      // provided address, and convert it from BigInt to a number with 18
      // decimal places.
      checkUserBalance(address).then((balance) => {
        setBalance(Number(formatUnits(balance, 18)));
      });
    } catch (error) {
      // Log any errors to the console.
      console.log(error);
    }
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

      <p className="text-lg font-medium mt-4 text-gray-600">
        Wallet balance is: {balance} MTK
      </p>
    </form>
  );
};

export default BalanceCheckForm;

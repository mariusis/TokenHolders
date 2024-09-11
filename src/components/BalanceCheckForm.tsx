import { Button, Label, TextInput, Card } from "flowbite-react";

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
      throw error;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4.5rem)] items-center">
      <Card className="w-[90%] max-w-md mx-auto p-8 mt-2 shadow-md flex align-center  sm:max-w-lg">
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <Label className="text-lg font-medium mb-2" htmlFor="wallet-address">
            Check a wallet's address here
          </Label>
          <TextInput
            id="wallet-address"
            className="w-full"
            type="text"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
              setBalance(0);
            }}
            placeholder="Enter wallet address"
            required
          />
          <Button className="w-full mt-4" type="submit">
            Check Balance
          </Button>
          <p className="text-lg font-medium mt-4 text-gray-600">
            Wallet balance is: {balance} MTK
          </p>
        </form>
      </Card>
    </div>
  );
};

export default BalanceCheckForm;

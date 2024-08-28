import React, { useEffect, useState } from "react";
import { addTokenHolder, getTokenHolders } from "../database/db"; // Corrected imports
import TokenHolder from "../models/TokenHolderModel";

const DatabaseInfo: React.FC = () => {
  const [tokenHolder, setTokenHolder] = useState<TokenHolder[]>([]); // Define the state type

  // Function to load tokenHolder
  const loadtokenHolder = async () => {
    const tokenHolderData = await getTokenHolders();
    setTokenHolder(tokenHolderData);
  };

  // Function to add a wallet
  const addNewTokenHolder = async () => {
    await addTokenHolder("0x123...", 100);
    await loadtokenHolder(); // Reload tokenHolder after adding
  };

  // Use effect to load tokenHolder initially
  useEffect(() => {
    loadtokenHolder();
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <div>
      <button onClick={addNewTokenHolder}>Add Wallet</button>
      <ul>
        {tokenHolder.map((wallet) => (
          <li key={wallet.id}>
            {wallet.address}: {wallet.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatabaseInfo;

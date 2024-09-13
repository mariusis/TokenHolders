import React, { useEffect, useState } from "react";
import startTransferEventListener, {
  eventEmmiter,
} from "../services/TransferEventListener"; // Ensure the correct path

import db from "../lib/dexie.config"; // Ensure the correct path
import fetchData from "../hooks/InitializeTransferData";

/**
 * HeroText component
 *
 * Displays the number of wallets owning a particular token
 *
 * @returns {React.ReactElement} - A JSX element
 */
const HeroText: React.FC = () => {
  const [tokenHolders, setTokenHolders] = useState<number>(0);

  /**
   * Updates the state of the component by fetching the number of token holders
   * from the database
   */
  const updateState = async () => {
    const data = await db.table("tokenHolders").toArray();
    setTokenHolders(data.length);
  };

  /**
   * Initializes the component by fetching the data and starting the
   * TransferEventListener
   */
  useEffect(() => {
    const initialize = async () => {
      await fetchData();

      startTransferEventListener();
      updateState();
    };

    initialize();
  }, []);

  /**
   * Listens for the "transfer" event and updates the state if it is triggered
   */
  eventEmmiter.on("transfer", () => {
    updateState();
  });

  return (
    <div className="h-fit w-full absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-center">
      <p className="text-2xl font-bold text-blue-950 dark:text-white">
        There are currently
      </p>
      <p className="text-4xl font-bold text-blue-950 dark:text-white">
        {tokenHolders > 0 ? tokenHolders : <span>&nbsp;</span>}
      </p>
      <p className="text-2xl font-bold text-blue-950 dark:text-white">
        wallets owning this token
      </p>
    </div>
  );
};

export default HeroText;

import { useEffect, useState } from "react";
import Wallet from "../models/Wallet";

import fetchData from "../hooks/InitializeTransferData";
import db from "../lib/dexie.config";
import TransferEventListener, {
  stopTransferEventListener,
} from "../services/TransferEventListener";

import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Button, Card, Table, Tooltip } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HolderWalletsDisplay = () => {
  const [wallets, setWallets] = useState([] as Wallet[]);

  library.add(faCopy);

  useEffect(() => {
    // Initialize the data
    fetchData();

    const intervalId = setInterval(fetchData, 10000); // Set the interval to update the data every 1 second

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

        setWallets(data);
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
    <div className="flex h-[calc(100vh-4.5rem)] items-center">
      <Card className="bg-white w-fit mx-auto rounded-lg shadow-md">
        <Table hoverable className="w-full">
          <Table.Head>
            <Table.HeadCell className="text-gray-500 text-center">
              Address
            </Table.HeadCell>
            <Table.HeadCell className="text-gray-500 text-center">
              Balance
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {wallets.map((wallet, index) => (
              <Table.Row key={index} className="hover:bg-gray-100">
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://sepolia.etherscan.io/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px] sm:max-w-none"
                    >
                      {wallet.address}
                    </a>
                    <Tooltip content="Copy to clipboard">
                      <Button
                        size="xs"
                        color="gray"
                        onClick={() =>
                          navigator.clipboard.writeText(wallet.address)
                        }
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                    </Tooltip>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-center">
                  {wallet.balance}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default HolderWalletsDisplay;

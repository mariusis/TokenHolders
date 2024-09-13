import { useEffect, useState } from "react";
import Wallet from "../models/Wallet";

import fetchData from "../hooks/InitializeTransferData";
import db from "../lib/dexie.config";

import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Button, Card, Table, Tooltip } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import startTransferEventListener, {
  eventEmmiter,
} from "../services/TransferEventListener";

/**
 * A component that displays a table of token holders and their balances.
 * It also supports pagination and listens to the "Transfer" event to
 * update the balances in real-time.
 */
const HolderWalletsDisplay = () => {
  const [wallets, setWallets] = useState([] as Wallet[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  /**
   * A hook to add the "faCopy" icon to the Font Awesome library.
   */
  library.add(faCopy);

  /**
   * A function to update the state of the component with the latest data
   * from the Dexie database.
   */
  const updateState = async () => {
    const data = await db.table("tokenHolders").toArray();
    setWallets(data);
  };

  /**
   * A hook to initialize the component by fetching the data from the
   * Dexie database and starting the transfer event listener.
   */
  useEffect(() => {
    const initialize = async () => {
      await fetchData();
      startTransferEventListener();
    };

    initialize();
  }, []);

  /**
   * A hook to update the state of the component whenever the data in the
   * Dexie database changes.
   */
  useEffect(() => {
    updateState();
  }, []);

  /**
   * A function to handle the "transfer" event emitted by the transfer event
   * listener. It updates the state of the component with the latest data
   * from the Dexie database.
   */
  eventEmmiter.on("transfer", () => {
    updateState();
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWallets = wallets.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(wallets.length / itemsPerPage);

  /**
   * A function to handle pagination. It updates the state of the component
   * with the page number and triggers the updateState function.
   */
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    updateState();
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center ">
      <Card className="bg-gray-50 w-fit mx-auto my-10 rounded-lg shadow-md border-2 ">
        <Table hoverable className="w-full ">
          <Table.Head>
            <Table.HeadCell className="text-gray-500 text-center">
              Address
            </Table.HeadCell>
            <Table.HeadCell className="text-gray-500 text-center">
              Balance
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {currentWallets.map((wallet, index) => (
              <Table.Row key={index} className="hover:bg-gray-100 relative">
                <Table.Cell>
                  <div className="flex items-center justify-between gap-2 ">
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
                        onClick={() => {
                          alert("Wallet address copied to clipboard");
                          navigator.clipboard.writeText(wallet.address);
                        }}
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

        {/* Pagination controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => paginate(index + 1)}
              color={currentPage === index + 1 ? "blue" : "gray"}
              size="xs"
              className="mx-1"
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HolderWalletsDisplay;

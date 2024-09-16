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
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

/**
 * A component that displays a table of token holders and their balances.
 * It also supports pagination and listens to the "Transfer" event to
 * update the balances in real-time.
 */
const HolderWalletsDisplay = () => {
  const [wallets, setWallets] = useState([] as Wallet[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  const [sorted, setSorted] = useState(1);
  const tokenSupply = 100000;

  function sortBalances(): void {
    if (sorted == 0) {
      wallets.sort((a, b) => b.balance - a.balance);
      setSorted(1);
    } else {
      wallets.sort((a, b) => a.balance - b.balance);
      setSorted(0);
    }
  }

  /**
   * A hook to add the "faCopy" icon to the Font Awesome library.
   */
  library.add(faCopy);
  library.add(faSortUp);
  library.add(faSortDown);

  /**
   * A function to update the state of the component with the latest data
   * from the Dexie database.
   */
  const updateState = async () => {
    const data = await db.table("tokenHolders").toArray();
    data.sort((a, b) => b.balance - a.balance);
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

      updateState();
    };

    initialize();
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
    <div className="flex min-h-[calc(100vh-5rem)] items-center px-4">
      <Card className="bg-gray-50 w-full max-w-[95%] sm:max-w-[80%] lg:max-w-[60%] mx-auto my-10 rounded-lg shadow-md border-2">
        <Table hoverable className="w-full">
          <Table.Head className="" p-2>
            <Table.HeadCell className="text-gray-500 text-center">
              Address
            </Table.HeadCell>
            <Table.HeadCell className="text-gray-500 text-left w-[30%] p-2 ">
              <button className="w-fit" onClick={sortBalances}>
                Balance{" "}
                <FontAwesomeIcon
                  className="relative ml-2"
                  icon={sorted === 1 ? faSortUp : faSortDown}
                />
              </button>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {currentWallets.map((wallet, index) => (
              <Table.Row key={index} className="hover:bg-gray-100 relative">
                <Table.Cell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] sm:max-w-[150px] p-2">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`https://sepolia.etherscan.io/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 overflow-hidden text-ellipsis"
                    >
                      {wallet.address}
                    </a>
                    <Tooltip content="Copy to clipboard">
                      <Button
                        size="xs"
                        color="gray"
                        onClick={() => {
                          navigator.clipboard.writeText(wallet.address);
                        }}
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </Button>
                    </Tooltip>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-center max-w-[50px] sm:max-w-[75px] overflow-hidden text-ellipsis ">
                  <p className=" text-center">{wallet.balance}</p>
                  <p className=" text-center">
                    ({((wallet.balance / tokenSupply) * 100).toFixed(2)} %)
                  </p>
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

import { useEffect, useState } from "react";
import getAllTransactionsForContract, {
  getAllHolders,
} from "../hooks/TokenHolders";

const TokenInfoDisplay = () => {
  const [tokenHolders, setTokenHolders] = useState(0);

  // getAllHolders();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllTransactionsForContract();
        setTokenHolders(data.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return <div>{tokenHolders}</div>;
};

export default TokenInfoDisplay;

import { Button, Label, TextInput, Card } from "flowbite-react";
import { useState } from "react";

const SwapTokens = () => {
  const [ethAmount, setEthAmount] = useState<string>(""); // SepoliaETH amount input
  const [tokenAmount, setTokenAmount] = useState<string>(""); // Token amount input
  const [swapRate, setSwapRate] = useState<number>(1000000); // Example: 1 SepoliaETH = 1,000,000 tokens

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Swap logic goes here, e.g., calling smart contract swap function
    console.log(
      `Swapping ${ethAmount} ETH for ${Number(ethAmount) * swapRate} tokens`
    );
  };

  // Automatically calculate token amount based on ETH input
  const handleEthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ethValue = e.target.value;
    setEthAmount(ethValue);
    if (!isNaN(parseFloat(ethValue))) {
      setTokenAmount((parseFloat(ethValue) * swapRate).toFixed(2));
    }
  };

  // Automatically calculate ETH amount based on Token input
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tokenValue = e.target.value;
    setTokenAmount(tokenValue);
    if (!isNaN(parseFloat(tokenValue))) {
      setEthAmount((parseFloat(tokenValue) / swapRate).toFixed(6)); // Adjust precision based on desired ETH granularity
    }
  };

  return (
    <div className="flex h-[calc(100vh-4.5rem)] items-center">
      <Card className="w-[90%] max-w-md mx-auto p-8 mt-2 shadow-md flex align-center sm:max-w-lg">
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          {/* Input for SepoliaETH */}
          <Label className="text-lg font-medium mb-2" htmlFor="eth-amount">
            Enter SepoliaETH amount
          </Label>
          <TextInput
            id="eth-amount"
            className="w-full"
            type="number"
            value={ethAmount}
            onChange={handleEthChange}
            placeholder="Enter ETH amount"
            required
            step={0.00001} // ETH increments
          />

          {/* Input for Token amount */}
          <Label
            className="text-lg font-medium mt-4 mb-2"
            htmlFor="token-amount"
          >
            Token amount (MTK)
          </Label>
          <TextInput
            id="token-amount"
            className="w-full"
            type="number"
            value={tokenAmount}
            onChange={handleTokenChange}
            placeholder="Enter Token amount"
            required
            step={1} // Token increments
            min="1" // Minimum Token amount
          />

          <Button className="w-full mt-4" type="submit">
            Swap Tokens
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SwapTokens;

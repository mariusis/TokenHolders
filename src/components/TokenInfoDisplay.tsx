import logo from "../assets/logo.png";

import { Button } from "flowbite-react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessage from "./ErrorMessage";
import HeroText from "./HeroText";

const TokenInfoDisplay = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] items-center justify-center relative">
      {/* Sepolia redirect button */}
      <div className="absolute top-4 justify-center">
        <a
          href={`https://sepolia.etherscan.io/address/0xb1EA3b0211bee07388937Ae6Bdf2537c62DD6B92`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button color="blue" className="mt-4">
            Etherscan Link
          </Button>
        </a>
      </div>

      {/* Token holders number message */}
      <div className="relative">
        <div
          className="aspect-square min-w-[500px] text-center flex flex-col justify-evenly items-center rounded-3xl p-10 mt-4 bg-image "
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: "cover",
            opacity: 0.6,
          }}
        ></div>
        <ErrorBoundary FallbackComponent={ErrorMessage}>
          <HeroText></HeroText>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default TokenInfoDisplay;

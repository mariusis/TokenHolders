import TokenInfoDisplay from "./TokenInfoDisplay";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessage from "./ErrorMessage";

const Home = () => {
  return (
    <div>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div>
            <ErrorMessage
              error={error}
              resetErrorBoundary={resetErrorBoundary}
            />
          </div>
        )}
      >
        <TokenInfoDisplay />
      </ErrorBoundary>
    </div>
  );
};

export default Home;

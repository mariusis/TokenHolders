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

      <p>The rest of the home component</p>
    </div>
  );
};

export default Home;

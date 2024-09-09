// ErrorComponent.tsx
import React from "react";

interface ErrorComponentProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div>
      <h1>Something went wrong.</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

export default ErrorComponent;

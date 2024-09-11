import "./App.css";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import BalanceCheckForm from "./components/BalanceCheckForm";
import HolderWalletsDisplay from "./components/HolderWalletsDisplay";
import Footer from "./components/Footer";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessage from "./components/ErrorMessage";
import TokenInfoDisplay from "./components/TokenInfoDisplay";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Global error handler for synchronous errors
    window.onerror = function (message, source, lineno, colno, error) {
      console.error("Global Error Caught:", {
        message,
        source,
        lineno,
        colno,
        error,
      });

      // You can send the error details to a logging service if needed
      // sendErrorToServer({ message, source, lineno, colno, error });

      return true; // Prevents the default browser error handling
    };

    // Global handler for unhandled promise rejections
    window.addEventListener("unhandledrejection", function (event) {
      console.error("Unhandled Promise Rejection:", event.reason);

      // Optionally, send the error details to a logging service
      // sendErrorToServer(event.reason);

      event.preventDefault(); // Prevent the default browser behavior
    });

    // Cleanup listeners on unmount
    return () => {
      window.onerror = null;
      window.removeEventListener("unhandledrejection", () => {});
    };
  }, []);

  return (
    <Flowbite>
      <div className="flex flex-col min-h-screen flex-grow dark:bg-gray-900">
        <Router>
          <Navbar />
          <Routes>
            <Route
              path="/TokenHolders"
              element={
                <ErrorBoundary
                  fallbackRender={({ error, resetErrorBoundary }) => (
                    <div>
                      <ErrorMessage
                        error={error}
                        resetErrorBoundary={resetErrorBoundary}
                      />
                      {/* Render the component that has an error */}
                    </div>
                  )}
                >
                  <TokenInfoDisplay />
                </ErrorBoundary>
              }
            />
            <Route
              path="/TokenHolders/balanceCheck"
              element={
                <ErrorBoundary
                  fallbackRender={({ error, resetErrorBoundary }) => (
                    <div>
                      <ErrorMessage
                        error={error}
                        resetErrorBoundary={resetErrorBoundary}
                      />
                      <BalanceCheckForm /> // Render TokenInfoDisplay even if an
                      error occurs
                    </div>
                  )}
                >
                  <BalanceCheckForm />
                </ErrorBoundary>
              }
            />
            <Route
              path="/TokenHolders/holderWallets"
              element={
                <ErrorBoundary
                  fallbackRender={({ error, resetErrorBoundary }) => (
                    <div>
                      <ErrorMessage
                        error={error}
                        resetErrorBoundary={resetErrorBoundary}
                      />
                      <HolderWalletsDisplay /> // Render TokenInfoDisplay even
                      if an error occurs
                    </div>
                  )}
                >
                  <HolderWalletsDisplay />
                </ErrorBoundary>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </div>
    </Flowbite>
  );
}

export default App;

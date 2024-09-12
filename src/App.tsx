import "./App.css";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import BalanceCheckForm from "./components/BalanceCheckForm";
import HolderWalletsDisplay from "./components/HolderWalletsDisplay";
import Footer from "./components/Footer";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessage from "./components/ErrorMessage";

import { useEffect, useState } from "react";
import Home from "./components/Home";

interface GlobalError {
  message: string | Event;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
}

function App() {
  const [globalError, setGlobalError] = useState<GlobalError | null>(null);
  const [showModal, setShowModal] = useState(false);

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
      setGlobalError({
        message,
        source,
        lineno,
        colno,
        error,
      });
      setShowModal(true);
    };

    // Global handler for unhandled promise rejections
    window.addEventListener("unhandledrejection", function (event) {
      console.error("Unhandled Promise Rejection(Global):", event.reason);
      setGlobalError({
        message: event.reason.message,
        source: "",
        lineno: 0,
        colno: 0,
        error: event.reason,
      });
      setShowModal(true);
    });

    // Cleanup listeners on unmount
    return () => {
      window.onerror = null;
      window.removeEventListener("unhandledrejection", () => {});
    };
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Flowbite>
      <div className="flex flex-col min-h-screen flex-grow dark:bg-gray-900">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/TokenHolders" element={<Home />} />
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
        {showModal && globalError && (
          <ErrorMessage
            error={globalError.error}
            resetErrorBoundary={handleCloseModal}
          />
        )}
      </div>
    </Flowbite>
  );
}

export default App;

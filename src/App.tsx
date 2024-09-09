import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import BalanceCheckForm from "./components/BalanceCheckForm";
import HolderWalletsDisplay from "./components/HolderWalletsDisplay";
import Footer from "./components/Footer";
import ErrorBoundary from "./utils/ErrorBoundary";

function App() {
  return (
    <div className="flex flex-col min-h-screen flex-grow">
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/TokenHolders"
            element={
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            }
          />
          <Route
            path="/TokenHolders/balanceCheck"
            element={
              <ErrorBoundary>
                <BalanceCheckForm />
              </ErrorBoundary>
            }
          />
          <Route
            path="/TokenHolders/holderWallets"
            element={
              <ErrorBoundary>
                <HolderWalletsDisplay />
              </ErrorBoundary>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

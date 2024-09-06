import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import BalanceCheckForm from "./components/BalanceCheckForm";
import HolderWalletsDisplay from "./components/HolderWalletsDisplay";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/TokenHolders" element={<Home />} />
          <Route
            path="/TokenHolders/balanceCheck"
            element={<BalanceCheckForm />}
          />
          <Route
            path="/TokenHolders/holderWallets"
            element={<HolderWalletsDisplay />}
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

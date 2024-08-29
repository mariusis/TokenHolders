import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import DatabaseInfo from "./components/DatabaseInfo";
import TokenInfoDisplay from "./components/TokenInfoDisplay";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/TokenHolders" element={<Home />} />
            <Route path="/holders" element={<TokenInfoDisplay />} />
            <Route path="/database" element={<DatabaseInfo />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;

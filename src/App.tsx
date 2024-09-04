import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
  return (
    <div className="text-center">
      <Router>
        <Routes>
          <Route path="/TokenHolders" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

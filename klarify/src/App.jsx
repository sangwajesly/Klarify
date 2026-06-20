import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InputFlow from "./pages/InputFlow";
import Results from "./pages/Results";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GceResults from "./pages/GceResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/flow" element={<InputFlow />} />
        <Route path="/results" element={<Results />} />
        <Route path="/gce-results" element={<GceResults />} />
      </Routes>
    </Router>
  );
}

export default App;

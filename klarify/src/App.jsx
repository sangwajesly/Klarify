import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InputFlow from "./pages/InputFlow";
import Results from "./pages/Results";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GceResults from "./pages/GceResults";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import InstallPrompt from "./components/InstallPrompt";

function App() {
  return (
    <Router>
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/flow" element={<InputFlow />} />
        <Route path="/results" element={<Results />} />
        <Route path="/gce-results" element={<GceResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;

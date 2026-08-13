import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InputFlow from "./pages/InputFlow";
import Results from "./pages/Results";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GceResults from "./pages/GceResults";
import ExamDetails from "./pages/ExamDetails";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import VerifyPhone from "./pages/VerifyPhone";
import Profile from "./pages/Profile";
import InstallPrompt from "./components/InstallPrompt";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Analytics from "./components/Analytics";

// Future Architecture Placeholder
const ComingSoon = ({ title }) => (
  <Layout>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{title}</h1>
      <p className="text-slate-600 text-lg">This section is currently under development. Check back soon!</p>
    </div>
  </Layout>
);


function App() {
  return (
    <Router>
      <Analytics />
      <ScrollToTop />
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/flow" element={<InputFlow />} />
        <Route path="/results" element={<Results />} />
        <Route path="/gce-results" element={<GceResults />} />
        <Route path="/exam-details" element={<ExamDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/verify-phone" element={<VerifyPhone />} />
        <Route path="/profile" element={<Profile />} />

        {/* Future Architecture Routes */}
        <Route path="/universities" element={<ComingSoon title="Universities in Cameroon" />} />
        <Route path="/universities/:id" element={<ComingSoon title="University Profile" />} />
        <Route path="/programs" element={<ComingSoon title="Academic Programs" />} />
        <Route path="/programs/:id" element={<ComingSoon title="Program Details" />} />
        <Route path="/guides" element={<ComingSoon title="Educational Guides" />} />
        <Route path="/careers" element={<ComingSoon title="Career Pathways" />} />
        <Route path="/skills" element={<ComingSoon title="Skills & Certifications" />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;

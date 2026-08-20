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
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import Universities from "./pages/Universities";
import UniversityDetails from "./pages/UniversityDetails";
import PartnersLanding from "./pages/PartnersLanding";
import PartnerRegister from "./pages/PartnerRegister";
import PartnerDashboard from "./pages/PartnerDashboard";
import PartnerPrograms from "./pages/PartnerPrograms";
import PartnerLogin from "./pages/PartnerLogin";
import GuideDetails from "./pages/GuideDetails";
import Guides from "./pages/Guides";
import InstallPrompt from "./components/InstallPrompt";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Analytics from "./components/Analytics";

// Future Architecture Placeholder
const ComingSoon = ({ title }) => (
  <Layout>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
        {title}
      </h1>
      <p className="text-slate-600 text-lg">
        This section is currently under development. Check back soon!
      </p>
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

        {/* Partner Portal Routes */}
        <Route path="/partners" element={<PartnersLanding />} />
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route path="/partner/programs" element={<PartnerPrograms />} />

        {/* Architecture Routes */}
        <Route path="/universities" element={<Universities />} />
        <Route path="/universities/:id" element={<UniversityDetails />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<ProgramDetails />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/:slug" element={<GuideDetails />} />
        <Route
          path="/careers"
          element={<ComingSoon title="Career Pathways" />}
        />
        <Route
          path="/skills"
          element={<ComingSoon title="Skills & Certifications" />}
        />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;

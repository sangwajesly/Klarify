import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  BookOpen,
  Target,
  Zap,
  ShieldCheck,
  ArrowRight,
  X,
} from "lucide-react";
import Layout from "../components/Layout";
import heroBg from "../assets/hero.jpg";

const PersonaCard = ({ icon: Icon, title, description, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={`
        relative overflow-hidden p-6 rounded-2xl border text-left transition-all duration-300 h-full flex flex-col backdrop-blur-sm w-full
        ${
          active
            ? "bg-white/10 border-white/30 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/20 group hover:bg-white/15 active:scale-[0.98]"
            : "bg-white/5 border-white/10 opacity-60 cursor-not-allowed"
        }
      `}
    >
      <div
        className={`
        w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors shrink-0
        ${active ? "bg-orange-500/30 text-orange-300 group-hover:bg-orange-500 group-hover:text-white" : "bg-white/10 text-white/40"}
      `}
      >
        <Icon size={24} />
      </div>
      <h3
        className={`text-lg font-bold mb-2 ${active ? "text-white" : "text-slate-300"}`}
      >
        {title}
      </h3>
      <p
        className={`text-sm mb-6 flex-1 ${active ? "text-slate-200" : "text-slate-400"}`}
      >
        {description}
      </p>

      {/* Explicit visual indicator that it is clickable or locked */}
      {active ? (
        <div className="mt-auto inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md group-hover:from-orange-400 group-hover:to-orange-500 transition-all w-full justify-center sm:w-auto">
          Start Recommendations
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      ) : (
        <div className="mt-auto inline-flex items-center gap-1.5 text-slate-400 font-semibold text-xs py-1.5 px-2.5 border border-white/10 bg-white/5 rounded-lg w-fit">
          Coming Soon
        </div>
      )}
    </button>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
    <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

const StepComponent = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center relative">
    <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold mb-6 z-10 relative border-4 border-white shadow-sm">
      {number}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [showGceBanner, setShowGceBanner] = React.useState(() => {
    return localStorage.getItem("dismissedGceBanner") !== "true";
  });

  const handleDismissGceBanner = () => {
    localStorage.setItem("dismissedGceBanner", "true");
    setShowGceBanner(false);
  };

  return (
    <Layout noPadding={true}>
      {/* GCE Results Live Announcement Banner */}
      {showGceBanner && (
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white relative z-20 shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center flex-1 min-w-0">
              <span className="flex p-1.5 rounded-lg bg-white/10 text-white">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></span>
              </span>
              <p className="ml-3 font-medium text-xs sm:text-sm text-white truncate">
                <span className="md:hidden">2025 Cameroonian GCE Results are Live!</span>
                <span className="hidden md:inline">🎉 2025 Cameroonian GCE Results are Live! Skip PDF scrolling and search instantly.</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/gce-results")}
                className="flex items-center justify-center px-4 py-1.5 border border-white/30 rounded-lg text-xs font-bold bg-white text-orange-600 hover:bg-orange-50 transition-all shadow-sm active:scale-95 shrink-0"
              >
                Search Now
              </button>
              <button
                onClick={handleDismissGceBanner}
                type="button"
                className="flex p-1 rounded-md hover:bg-white/10 focus:outline-none transition-colors shrink-0 text-white"
                aria-label="Dismiss banner"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[85vh] py-16 md:py-24 flex items-center justify-center overflow-hidden">
        {/* Background with gradient and shapes */}
        <div className="absolute inset-0 z-0">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundAttachment: "fixed",
            }}
          ></div>

          {/* Main gradient background overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/92 via-slate-900/88 to-slate-900/92"></div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-tr from-orange-500/25 via-transparent to-blue-500/15 opacity-80"></div>

          {/* Decorative blobs */}
          <div className="absolute top-20 -left-40 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto w-full flex flex-col items-center justify-center">
          {/* Core Value Prop & Persona Cards */}
          <div className="w-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 hover:bg-white/15 transition-all">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Klarify Your Future
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Find the Right <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
                Academic & Career
              </span>{" "}
              Path for You
            </h1>

            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed">
              Get personalized university and career recommendations based on
              your subjects and interests.
            </p>

            {/* Featured CTA Card — the one action users can take */}
            <div className="w-full max-w-md mx-auto mb-8">
              <button
                onClick={() => navigate("/flow")}
                className="group relative w-full rounded-2xl transition-all active:scale-[0.98]"
              >
                {/* Animated glow ring */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-2xl opacity-50 blur-sm group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Card body */}
                <div className="relative p-8 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-orange-500/30 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center mb-5 mx-auto shadow-lg shadow-orange-500/30">
                    <GraduationCap size={30} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">A/L Student</h3>
                  <p className="text-slate-300 text-sm mb-6 max-w-xs mx-auto">
                    Get matched to university programs and career paths based on your A-Level subjects.
                  </p>
                  <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/25 group-hover:from-orange-400 group-hover:to-orange-500 transition-all">
                    Get My Recommendations
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </button>
            </div>

            {/* Secondary — Coming Soon personas */}
            <div className="flex items-center gap-3 justify-center w-full max-w-md mx-auto">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <div className="w-9 h-9 rounded-lg bg-white/10 text-white/40 flex items-center justify-center shrink-0">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 truncate">University Student</p>
                  <p className="text-[10px] text-slate-500">Coming Soon</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <div className="w-9 h-9 rounded-lg bg-white/10 text-white/40 flex items-center justify-center shrink-0">
                  <BookOpen size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400 truncate">Self Learner</p>
                  <p className="text-[10px] text-slate-500">Coming Soon</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Use Klarify Section */}
      <section className="bg-slate-900 py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why use Klarify?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We take the guesswork out of your future by using advanced AI to
              map your current skills to the perfect opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Target}
              title="Highly Accurate"
              description="Our recommendation engine matches your unique A/L subjects and personal interests with real-world university programs."
            />
            <FeatureCard
              icon={Zap}
              title="Fast & Guided"
              description="No more scrolling through endless university prospectuses. Get tailored results in less than 2 minutes."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Comprehensive"
              description="We don't just suggest degrees. We provide the exam details, certifications, and books you need to succeed."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              A simple, 3-step process to discover your ideal academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-orange-100 z-0"></div>

            <StepComponent
              number="1"
              title="Tell us your background"
              description="Select the A/L subjects you have studied or are currently studying."
            />
            <StepComponent
              number="2"
              title="Share your interests"
              description="Describe what fields, careers, or topics you are passionate about."
            />
            <StepComponent
              number="3"
              title="Get your path"
              description="Instantly receive a curated list of degrees, certifications, and resources."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to find your path?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already discovered their ideal
            university programs and careers with Klarify.
          </p>
          <button
            onClick={() => navigate("/flow")}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-slate-900/20"
          >
            Start Your Free Assessment
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;

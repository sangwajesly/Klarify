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
  Building2,
  Award,
  BookMarked
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import FAQBlock from "../components/FAQBlock";
import heroBg from "../assets/hero.jpg";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <article className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
    <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
      <Icon size={24} aria-hidden="true" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </article>
);

const StepComponent = ({ number, title, description }) => (
  <article className="flex flex-col items-center text-center relative">
    <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold mb-6 z-10 relative border-4 border-white shadow-sm" aria-hidden="true">
      {number}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </article>
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

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KlarifyPath",
    "url": "https://www.klarifypath.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.klarifypath.com/gce-results?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "KlarifyPath is an AI-powered academic and career guidance platform focused on Cameroon. Get A-Level university program recommendations and GCE result searches."
  };

  const homeFaqs = [
    {
      question: "What is KlarifyPath?",
      answer: "KlarifyPath is an AI-powered educational platform designed specifically for Cameroonian students. It helps A-Level students find the best university programs and career paths based on their subjects and interests."
    },
    {
      question: "How do I choose a university program in Cameroon?",
      answer: "Choosing a program depends on your A-Level subjects, grades, and career interests. Our AI Recommender analyzes your specific subject combination (e.g., Biology, Chemistry, Math) and matches you with eligible degrees in Cameroonian universities."
    },
    {
      question: "Which programs require concours?",
      answer: "Many professional programs in Cameroon (like Medicine at FMSB, Engineering at ENSP, or Teaching at ENS) require a competitive entrance examination known as a 'concours'. KlarifyPath clearly labels which recommended programs require a concours."
    },
    {
      question: "Which universities are public in Cameroon?",
      answer: "Cameroon has several state universities including the University of Buea, University of Bamenda, University of Yaounde I & II, University of Douala, University of Dschang, University of Maroua, and University of Ngaoundere. Our platform recommends programs across these institutions."
    },
    {
      question: "Is KlarifyPath free to use?",
      answer: "Yes! Searching for GCE results and getting your initial AI-powered career and university recommendations is completely free for all Cameroonian students."
    }
  ];

  return (
    <Layout noPadding={true}>
      <SEOHead 
        title="KlarifyPath - University & Career Guidance in Cameroon"
        description="Discover the best university programs and career paths in Cameroon. Use our AI recommender based on your A-Level subjects and interests. Check GCE results instantly."
        canonicalUrl="https://www.klarifypath.com"
        structuredData={homeSchema}
      />

      <main>
        {/* GCE Results Live Announcement Banner */}
        {showGceBanner && (
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white relative z-20 shadow-md">
            <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center flex-1 min-w-0">
                <span className="flex p-1.5 rounded-lg bg-white/10 text-white" aria-hidden="true">
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
                  aria-label="Search GCE Results"
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
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroBg})`,
                backgroundAttachment: "fixed",
              }}
              aria-hidden="true"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-900/95"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/25 via-transparent to-blue-500/15 opacity-80"></div>
          </div>

          <div className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto w-full flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 hover:bg-white/15 transition-all">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                Cameroon's #1 Academic Guidance Platform
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Find the Right <br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
                  Academic & Career
                </span>{" "}
                Path
              </h1>

              <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed">
                Discover university programs and professional careers in Cameroon tailored specifically to your A-Level subjects and personal interests.
              </p>

              {/* Featured CTA Card */}
              <div className="w-full max-w-md mx-auto mb-8">
                <button
                  onClick={() => navigate("/flow")}
                  aria-label="Start Recommendations for A-Level Students"
                  className="group relative w-full rounded-2xl transition-all active:scale-[0.98]"
                >
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-2xl opacity-50 blur-sm group-hover:opacity-80 transition-opacity duration-500"></div>
                  <div className="relative p-8 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-orange-500/30 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center mb-5 mx-auto shadow-lg shadow-orange-500/30">
                      <GraduationCap size={30} aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">A-Level Students</h2>
                    <p className="text-slate-300 text-sm mb-6 max-w-xs mx-auto">
                      Get matched to university programs and career paths based on your GCE A-Level subjects.
                    </p>
                    <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/25 group-hover:from-orange-400 group-hover:to-orange-500 transition-all">
                      Get My Recommendations
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Secondary — Coming Soon personas */}
              <div className="flex items-center gap-3 justify-center w-full max-w-md mx-auto">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left">
                  <div className="w-9 h-9 rounded-lg bg-white/10 text-white/40 flex items-center justify-center shrink-0">
                    <User size={18} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-400 truncate">O-Level Students</h3>
                    <p className="text-[10px] text-slate-500">Coming Soon</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left">
                  <div className="w-9 h-9 rounded-lg bg-white/10 text-white/40 flex items-center justify-center shrink-0">
                    <BookOpen size={18} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-400 truncate">University Graduates</h3>
                    <p className="text-[10px] text-slate-500">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About KlarifyPath Section */}
        <section className="py-20 px-6 md:px-12 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">About KlarifyPath</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              KlarifyPath is Cameroon's premier educational platform designed to bridge the gap between high school education and career success. Every year, thousands of Cameroonian students struggle to navigate the complex higher education system.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              We solve this problem by providing an intelligent, AI-driven recommendation engine that analyzes your academic strengths (like GCE A-Level subjects) and personal interests to suggest the most appropriate public and private university programs, concours, and career pathways in Cameroon.
            </p>
          </div>
        </section>

        {/* Why Choose Us / Features */}
        <section className="bg-slate-900 py-20 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose KlarifyPath?
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                We take the guesswork out of your future by mapping your current skills to the perfect educational opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Target}
                title="Cameroon Specific"
                description="Our data is tailored exclusively to the Cameroonian education system, covering local state universities, private institutes, and national concours."
              />
              <FeatureCard
                icon={Zap}
                title="AI-Powered Matching"
                description="No more scrolling through endless prospectuses. Get tailored degree and career results instantly based on TF-IDF and Cosine Similarity."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Comprehensive Guidance"
                description="We don't just suggest degrees. We provide prerequisite information, concours requirements, and the skills you need to succeed."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-6 md:px-12 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                How It Works
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                A simple, 3-step process to discover your ideal academic journey in Cameroon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-orange-200 z-0" aria-hidden="true"></div>

              <StepComponent
                number="1"
                title="Select Your Subjects"
                description="Input the GCE A-Level subjects you have passed or are currently studying."
              />
              <StepComponent
                number="2"
                title="Share Your Interests"
                description="Describe the fields, careers, or topics you are passionate about pursuing."
              />
              <StepComponent
                number="3"
                title="Get Your Roadmap"
                description="Instantly receive a curated list of university degrees, required concours, and resources."
              />
            </div>
          </div>
        </section>

        {/* Universities Covered Section */}
        <section className="py-20 px-6 md:px-12 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Universities & Institutions Covered</h2>
            <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
              Our recommendation engine includes programs from top institutions across the national territory.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "University of Buea",
                "University of Bamenda",
                "University of Yaounde I",
                "University of Douala",
                "University of Dschang",
                "University of Maroua",
                "University of Ngaoundere",
                "Professional Concours (ENS, ENSP, FMSB)"
              ].map((uni, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-semibold text-slate-700">{uni}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <div className="bg-slate-50 py-10 px-6">
          <FAQBlock faqs={homeFaqs} title="Frequently Asked Questions About KlarifyPath" />
        </div>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-12 bg-orange-500">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to find your path?
            </h2>
            <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Cameroonian students who have already discovered their ideal university programs and careers with KlarifyPath.
            </p>
            <button
              onClick={() => navigate("/flow")}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-slate-900/20"
              aria-label="Start Your Free Assessment Now"
            >
              Start Your Free Assessment
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;

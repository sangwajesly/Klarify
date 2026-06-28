import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Loader2,
  GraduationCap,
  Building2,
  User,
  AlertCircle,
  Share2,
  Copy,
  Check,
  Zap,
  BookOpen,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import FAQBlock from "../components/FAQBlock";
import { API_URL } from "../services/api";
import heroBg from "../assets/hero.jpg";

const GceResults = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [examYear, setExamYear] = useState("2025");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://klarifypath.com/gce-results");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim().length < 3) {
      setError("Please enter at least 3 characters of your name.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await fetch(
        `${API_URL}/gce/search?name=${encodeURIComponent(query)}&exam_year=${examYear}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isOLevelResult = (result) => {
    const resultStr = JSON.stringify(result).toLowerCase();
    return resultStr.includes("o-level") || resultStr.includes("ordinary level") || resultStr.includes("o/l");
  };

  const gceSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Cameroon GCE Results Search Engine",
    "description": "Instantly search and find your Cameroon General Certificate of Education (GCE) Ordinary and Advanced Level results.",
    "url": "https://www.klarifypath.com/gce-results",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.klarifypath.com/gce-results?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const gceFaqs = [
    {
      question: "How does the GCE Search Engine work?",
      answer: "Our search engine connects to a digitized, highly optimized database of the official GCE results. When you type your name, it uses fuzzy text matching to find your candidate number, center, and passed subjects instantly without needing to download massive PDFs."
    },
    {
      question: "Is this the official GCE Board website?",
      answer: "No, KlarifyPath is an independent educational platform. We provide this search tool as a free public utility to help students check their results quickly and seamlessly transition into our career guidance and university recommendation tools."
    },
    {
      question: "When do the 2025 GCE Results become available?",
      answer: "Results typically become available between late July and early August. Our database is updated within minutes of the official release by the Cameroon GCE Board."
    },
    {
      question: "What should I do after checking my A-Level results?",
      answer: "Once you have confirmed your passed subjects, use our 'AI Recommender' tool right from this page! Input your passed subjects and interests to find out which university programs and professional concours you are eligible for."
    },
    {
      question: "What should I do after checking my O-Level results?",
      answer: "If you just passed your O-Levels, your next step is choosing the right A-Level subjects (Arts or Sciences) that align with your future career goals. You can also explore professional pathways or technical high schools."
    }
  ];

  return (
    <Layout noPadding={true}>
      <SEOHead 
        title="Check Cameroon GCE Results Instantly | KlarifyPath"
        description="Search your name to instantly check your Cameroon GCE Ordinary and Advanced Level results. No PDF downloads required. Find your results and get university recommendations."
        canonicalUrl="https://www.klarifypath.com/gce-results"
        structuredData={gceSchema}
      />

      <main className="relative min-h-screen flex flex-col items-center pt-28 overflow-hidden bg-slate-900">
        {/* Hero Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-60"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundAttachment: "fixed",
            }}
            aria-hidden="true"
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/85 to-slate-900/95"></div>
          <div className="absolute top-20 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center px-4 md:px-6">
          {/* Header Text */}
          <div className="w-full text-center space-y-6 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-2 hover:bg-white/15 transition-all">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Klarify Results Engine
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Check Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                GCE Results
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              No more scrolling through massive PDFs! Find your GCE results
              instantly in just a few seconds.
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-4xl mx-auto mt-8 flex flex-col md:flex-row gap-4"
              role="search"
            >
              {/* Year Selector */}
              <div className="relative min-w-full md:min-w-40">
                <select
                  aria-label="Select Examination Year"
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="w-full px-6 py-4 md:py-5 rounded-full border pr-16 border-white/20 bg-white/10 backdrop-blur-md text-white text-lg md:text-xl font-black text-center focus:outline-none focus:border-orange-500/50 transition-all shadow-2xl appearance-none cursor-pointer"
                >
                  <option value="2025" className="text-slate-900">2025</option>
                  <option value="2024" className="text-slate-900">2024</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-xs font-bold uppercase tracking-widest">
                  Year
                </div>
              </div>

              {/* Name Input */}
              <div className="relative flex-1 flex flex-col md:flex-row gap-3 md:gap-0 items-stretch md:items-center group">
                <div className="relative flex-1 flex items-center">
                  <Search
                    className="absolute left-6 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                    size={22}
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your full name (e.g. SANGWA JESLY)..."
                    aria-label="Search by candidate name"
                    className="w-full pl-14 md:pl-16 pr-6 md:pr-36 py-4 md:py-5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-base md:text-lg focus:outline-none focus:border-orange-500/50 focus:bg-white/15 transition-all shadow-2xl placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 px-8 py-4 md:py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transform hover:scale-105"
                  aria-label="Search Results"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </form>
            {error && (
              <p className="text-red-400 mt-2 text-center font-medium" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Results Container */}
          <div className="w-full space-y-6 pb-20" aria-live="polite">
            {searched && !loading && results.length === 0 && !error && (
              <div className="text-center py-10 md:py-16 px-4 md:px-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl mt-8">
                <p className="text-xl md:text-2xl text-slate-300 font-medium">
                  No results found for "{query}" in {examYear}.
                </p>
                <p className="text-sm md:text-base text-slate-400 mt-3 md:mt-4 max-w-md mx-auto">
                  Make sure you spelled your name exactly as it appears on your official GCE registration slip.
                </p>
              </div>
            )}

            {results.map((result) => (
              <article
                key={result.id}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl hover:bg-white/15 transition-all transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-orange-500/20 transition-colors"></div>

                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 relative z-10">
                  <div className="space-y-3 flex-1 w-full">
                    <div className="flex items-center gap-3 text-xl md:text-3xl font-bold text-white">
                      <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
                        <User size={24} className="text-orange-400 md:w-7 md:h-7" aria-hidden="true" />
                      </div>
                      <span className="break-words leading-tight">{result.candidate_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm md:text-lg text-slate-300">
                      <div className="p-1.5 bg-white/5 rounded-lg shrink-0">
                        <Building2 size={16} className="text-slate-400 md:w-5 md:h-5" aria-hidden="true" />
                      </div>
                      <span className="break-words">{result.center_number} - {result.center_name}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 px-6 py-3 md:px-8 md:py-4 rounded-2xl text-center w-full md:w-auto md:min-w-[200px] shrink-0">
                    <span className="block text-[10px] md:text-xs uppercase tracking-widest font-bold text-orange-300 mb-1">
                      Status
                    </span>
                    <span className="block text-xl md:text-2xl font-black text-white">
                      {result.passed_category}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex justify-center md:justify-end relative z-10">
                  {!isOLevelResult(result) ? (
                    <button
                      onClick={() => navigate("/flow")}
                      className="w-full md:w-auto justify-center flex items-center gap-2.5 text-orange-400 hover:text-orange-300 font-bold text-base md:text-lg transition-colors group/btn"
                    >
                      Find Recommended University Programs
                      <GraduationCap
                        size={20}
                        className="transform group-hover/btn:translate-x-1 transition-transform md:w-6 md:h-6"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/careers")}
                      className="w-full md:w-auto justify-center flex items-center gap-2.5 text-blue-400 hover:text-blue-300 font-bold text-base md:text-lg transition-colors group/btn"
                    >
                      Explore O-Level Career Pathways
                      <ArrowRight
                        size={20}
                        className="transform group-hover/btn:translate-x-1 transition-transform md:w-6 md:h-6"
                      />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Content & SEO Section Below Hero */}
      <section className="bg-slate-900 px-4 md:px-6 py-16 text-white relative">
        <div className="max-w-5xl mx-auto">
          {/* Core Highlights */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <article className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 shrink-0">
                <Zap size={24} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant & Data-Saving</h3>
              <p className="text-sm text-slate-300">
                Stop wasting mobile data downloading massive 500+ page PDFs. Search your name and find your status in milliseconds.
              </p>
            </article>

            <article className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 shrink-0">
                <Search size={24} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fuzzy Name Indexing</h3>
              <p className="text-sm text-slate-300">
                Our database engine handles middle names, spacing issues, and minor typos. Enter just a part of your name to start.
              </p>
            </article>

            <article className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 shrink-0">
                <GraduationCap size={24} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Beyond the Results</h3>
              <p className="text-sm text-slate-300">
                Finding your name is just the first step. Map your subjects directly to Cameroonian university courses and concours guidelines.
              </p>
            </article>
          </div>

          {/* Social Share Callout */}
          <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-6 md:p-10 text-center relative overflow-hidden mb-16 shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Save a Friend the Stress!</h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Do you know a classmate, relative, or family group waiting for their GCE results? Don't let them download huge PDFs. Share this link and let them check their results in seconds!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    "Check your Cameroon GCE results instantly by name without downloading massive PDFs! Visit https://klarifypath.com/gce-results"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba56] text-white font-bold py-3.5 px-8 rounded-full transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25"
                >
                  <Share2 size={20} />
                  Share on WhatsApp
                </a>
                
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold py-3.5 px-8 rounded-full transition-all flex items-center justify-center gap-2.5"
                >
                  {copied ? (
                    <><Check size={20} className="text-green-400" /> Link Copied!</>
                  ) : (
                    <><Copy size={20} /> Copy Share Link</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
           <FAQBlock faqs={gceFaqs} title="Cameroon GCE Result FAQs" />
        </div>
      </section>
    </Layout>
  );
};

export default GceResults;

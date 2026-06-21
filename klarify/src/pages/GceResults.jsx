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
} from "lucide-react";
import Layout from "../components/Layout";
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

  return (
    <Layout noPadding={true}>
      <section className="relative min-h-screen flex flex-col items-center pt-28 px-4 md:px-6 overflow-hidden">
        {/* Hero Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Strongly Blurred Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-60"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundAttachment: "fixed",
            }}
          ></div>

          {/* Heavy Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/95 via-slate-900/85 to-slate-900/95"></div>

          {/* Animated Decorative Blobs */}
          <div className="absolute top-20 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]">
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
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
          {/* Header Text */}
          <div className="w-full text-center space-y-6 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-2 hover:bg-white/15 transition-all">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Klarify Results Engine
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Check Your{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
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
            >
              {/* Year Selector */}
              <div className="relative min-w-full md:min-w-40">
                <select
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="w-full px-6 py-4 md:py-5 rounded-full border pr-16 border-white/20 bg-white/10 backdrop-blur-md text-white text-lg md:text-xl font-black text-center focus:outline-none focus:border-orange-500/50 transition-all shadow-2xl appearance-none cursor-pointer"
                >
                  <option value="2025" className="text-slate-900">
                    2025
                  </option>
                  {/* <option value="2024" className="text-slate-900">
                    2024
                  </option>
                  <option value="2023" className="text-slate-900 ">
                    2023
                  </option> */}
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
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your full name (e.g. SANGWA JESLY)..."
                    className="w-full pl-14 md:pl-16 pr-6 md:pr-36 py-4 md:py-5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-base md:text-lg focus:outline-none focus:border-orange-500/50 focus:bg-white/15 transition-all shadow-2xl placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 px-8 py-4 md:py-3.5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transform hover:scale-105"
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
              <p className="text-red-400 mt-2 text-center font-medium">
                {error}
              </p>
            )}
          </div>

          {/* Results Container */}
          <div className="w-full space-y-6 pb-20">
            {searched && !loading && results.length === 0 && !error && (
              <div className="text-center py-10 md:py-16 px-4 md:px-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl mt-8">
                <p className="text-xl md:text-2xl text-slate-300 font-medium">
                  No results found for "{query}" in {examYear}.
                </p>
                <p className="text-sm md:text-base text-slate-400 mt-3 md:mt-4 max-w-md mx-auto">
                  Make sure you spelled your name exactly as it appears on your
                  official GCE registration slip.
                </p>
              </div>
            )}

            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl hover:bg-white/15 transition-all transform hover:-translate-y-1 relative overflow-hidden group"
              >
                {/* Result Accent Blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-orange-500/20 transition-colors"></div>

                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 relative z-10">
                  <div className="space-y-3 flex-1 w-full">
                    <div className="flex items-center gap-3 text-xl md:text-3xl font-bold text-white">
                      <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
                        <User size={24} className="text-orange-400 md:w-7 md:h-7" />
                      </div>
                      <span className="wrap-break-words leading-tight">{result.candidate_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm md:text-lg text-slate-300">
                      <div className="p-1.5 bg-white/5 rounded-lg shrink-0">
                        <Building2 size={16} className="text-slate-400 md:w-5 md:h-5" />
                      </div>
                      <span className="wrap-break-words">{result.center_number} - {result.center_name}</span>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 px-6 py-3 md:px-8 md:py-4 rounded-2xl text-center w-full md:w-auto md:min-w-50 shrink-0">
                    <span className="block text-[10px] md:text-xs uppercase tracking-widest font-bold text-orange-300 mb-1">
                      Status
                    </span>
                    <span className="block text-xl md:text-2xl font-black text-white">
                      {result.passed_category}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex justify-center md:justify-end relative z-10">
                  <button
                    onClick={() => navigate("/flow")}
                    className="w-full md:w-auto justify-center flex items-center gap-2.5 text-orange-400 hover:text-orange-300 font-bold text-base md:text-lg transition-colors group/btn"
                  >
                    Find Universities for this Profile
                    <GraduationCap
                      size={20}
                      className="transform group-hover/btn:translate-x-1 transition-transform md:w-6 md:h-6"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Marketing & Awareness Sections */}
          <div className="w-full h-px bg-white/10 my-16"></div>

          {/* Core Highlights */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 shrink-0">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant & Data-Saving</h3>
              <p className="text-sm text-slate-300">
                Stop wasting mobile data downloading massive 500+ page PDFs. Search your name and find your status in milliseconds.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 shrink-0">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fuzzy Name Indexing</h3>
              <p className="text-sm text-slate-300">
                Our database engine handles middle names, spacing issues, and minor typos. Enter just a part of your name to start.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 shrink-0">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Beyond the Results</h3>
              <p className="text-sm text-slate-300">
                Finding your name is just the first step. Map your subjects directly to Cameroonian university courses and concours guidelines.
              </p>
            </div>
          </div>

          {/* About Service / Mission Statement */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
            {/* Story Card */}
            <div className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col justify-center lg:col-span-7">
              <span className="text-xs uppercase tracking-widest font-black text-orange-400 mb-2">Our Mission</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">
                The First GCE Results Search Engine in Cameroon
              </h2>
              <div className="text-sm md:text-base text-slate-300 leading-relaxed space-y-4">
                <p>
                  Every year, GCE Results day brings excitement and anxiety in equal measure. Historically, students and parents in Cameroon have had to scour through massive, resource-heavy PDF documents or travel directly to examination centers just to search for a single candidate name.
                </p>
                <p>
                  We believed there had to be a better way. Klarify GCE Results Engine was built to digitize this process, offering a fast, clean, and data-efficient alternative. No downloads. No endlessly scrolling through 500 pages. Just instant results.
                </p>
              </div>
            </div>

            {/* Next Steps CTA Card */}
            <div className="bg-linear-to-br from-orange-500/20 via-orange-600/10 to-transparent backdrop-blur-md p-8 md:p-10 rounded-3xl border border-orange-500/30 flex flex-col justify-between lg:col-span-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
              
              <div className="relative z-10 space-y-4">
                <span className="text-xs uppercase tracking-widest font-black text-orange-400">Orientation Reimagined</span>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                  Your Results Are In. What's Next?
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Passing the GCE is a massive milestone, but the path ahead can be confusing. Which university programs accept your subject combination? Which national competitive entrance exams (Concours) are open to you?
                </p>
              </div>

              <div className="mt-8 relative z-10">
                <button
                  onClick={() => navigate("/flow")}
                  className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transform hover:scale-105"
                >
                  Start Orientation Assessment
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Social Share Callout */}
          <div className="w-full bg-linear-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 text-center relative overflow-hidden mb-16">
            <div className="absolute inset-0 bg-linear-to-tr from-orange-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Save a Friend the Stress!
              </h2>
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
                    <>
                      <Check size={20} className="text-green-400" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      Copy Share Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GceResults;

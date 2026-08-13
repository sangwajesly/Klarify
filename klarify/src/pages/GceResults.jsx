import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Loader2,
  GraduationCap,
  Building2,
  User,
  Share2,
  Copy,
  Check,
  Zap,
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
  const [examType, setExamType] = useState("");
  const [examYear, setExamYear] = useState("2025");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const EXAM_TYPES = [
    { id: "", label: "All Levels" },
    { id: "GEN_A", label: "A-Level" },
    { id: "GEN_O", label: "O-Level" },
    { id: "TVE_A", label: "Technical AL" },
    { id: "TVE_O", label: "Technical OL" },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://klarifypath.com/gce-results");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchResults = async (searchQuery, year, type) => {
    if (searchQuery.trim().length < 3) {
      setError("Please enter at least 3 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      let url = `${API_URL}/gce/search?name=${encodeURIComponent(searchQuery)}&exam_year=${year}`;
      if (type) {
        url += `&exam_type=${type}`;
      }

      const response = await fetch(url);
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(query, examYear, examType);
  };

  const handleTabChange = (typeId) => {
    setExamType(typeId);
    if (searched && query.trim().length >= 3) {
      fetchResults(query, examYear, typeId);
    }
  };

  const isOLevelResult = (result) => {
    if (result.exam_type) {
      return result.exam_type === "GEN_O" || result.exam_type === "TVE_O";
    }
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

      <main className="relative min-h-screen flex flex-col items-center pt-24 bg-slate-900 overflow-hidden">
        {/* Background — single consistent warm overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-40"
            style={{ backgroundImage: `url(${heroBg})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900" />
        </div>

        {/* ── Main content ── */}
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center px-4 md:px-6">

          {/* Header */}
          <div className="w-full text-center mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/8 text-white text-xs font-medium backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" aria-hidden="true" />
              Klarify Results Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Check Your{" "}
              <span className="text-orange-400">GCE Results</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-xl mx-auto">
              No more scrolling through massive PDFs. Find your GCE results
              instantly in just a few seconds.
            </p>

            {/* Level filters */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {EXAM_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTabChange(type.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-200 ${
                    examType === type.id
                      ? "bg-orange-500 text-white"
                      : "bg-white/8 border border-white/15 text-slate-300 hover:bg-white/12 hover:text-white"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Search form */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-3xl mx-auto mt-6"
              role="search"
            >
              <div className="flex flex-col md:flex-row gap-3">
                {/* Year selector */}
                <div className="relative md:w-32 shrink-0">
                  <select
                    aria-label="Select Examination Year"
                    value={examYear}
                    onChange={(e) => setExamYear(e.target.value)}
                    className="w-full appearance-none px-4 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm font-semibold text-center focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/20 transition-all cursor-pointer pr-9"
                  >
                    <option value="2025" className="text-slate-900 bg-white">2025</option>
                    <option value="2024" className="text-slate-900 bg-white">2024</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>

                {/* Name input + submit */}
                <div className="flex-1 flex gap-3">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter candidate name or center number..."
                      aria-label="Search by candidate name or center number"
                      className="w-full pl-11 pr-5 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm focus:outline-none focus:border-orange-400/60 focus:ring-2 focus:ring-orange-400/20 focus:bg-white/12 transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-4 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 text-white font-bold text-sm rounded-2xl transition-colors duration-200 flex items-center gap-2 shrink-0"
                    aria-label="Search Results"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 mt-3 text-sm text-center font-medium" role="alert">
                  {error}
                </p>
              )}
            </form>
          </div>

          {/* ── Results ── */}
          <div className="w-full space-y-4 pb-20" aria-live="polite">
            {searched && !loading && results.length === 0 && !error && (
              <div className="text-center py-12 px-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mt-4">
                <p className="text-lg text-slate-300 font-medium">
                  No results found for "{query}" in {examYear}.
                </p>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  Make sure you spelled your name exactly as it appears on your official GCE registration slip.
                </p>
              </div>
            )}

            {results.map((result) => (
              <article
                key={result.id}
                className="bg-white/8 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/12 transition-colors duration-200 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 text-xl md:text-2xl font-bold text-white">
                      <div className="p-2 bg-orange-500/15 rounded-lg shrink-0">
                        <User size={20} className="text-orange-400" aria-hidden="true" />
                      </div>
                      <span className="break-words leading-tight">{result.candidate_name}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-slate-400 pl-12">
                      <Building2 size={14} aria-hidden="true" />
                      <span>{result.center_number} — {result.center_name}</span>
                    </div>
                  </div>

                  <div className="border border-orange-500/25 bg-orange-500/10 px-6 py-3 rounded-xl text-center shrink-0 md:min-w-[180px]">
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-orange-400 mb-1">
                      Status
                    </span>
                    <span className="block text-lg font-black text-white">
                      {result.passed_category}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/8 flex justify-end">
                  {!isOLevelResult(result) ? (
                    <button
                      onClick={() => navigate("/flow")}
                      className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold text-sm transition-colors group/btn"
                    >
                      Find Recommended University Programs
                      <GraduationCap
                        size={16}
                        className="transition-transform duration-200 group-hover/btn:translate-x-1"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/careers")}
                      className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold text-sm transition-colors group/btn"
                    >
                      Explore O-Level Career Pathways
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-200 group-hover/btn:translate-x-1"
                      />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* ── Content below hero ── */}
      <section className="bg-slate-900 px-4 md:px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Core highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {[
              {
                icon: Zap,
                title: "Instant & Data-Saving",
                body: "Stop wasting mobile data downloading massive 500+ page PDFs. Search your name and find your status in milliseconds.",
              },
              {
                icon: Search,
                title: "Fuzzy Name Indexing",
                body: "Our database engine handles middle names, spacing issues, and minor typos. Enter just a part of your name to start.",
              },
              {
                icon: GraduationCap,
                title: "Beyond the Results",
                body: "Finding your name is just the first step. Map your subjects directly to Cameroonian university courses and concours guidelines.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center mb-4 shrink-0">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
              </article>
            ))}
          </div>

          {/* Share callout */}
          <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-8 md:p-10 text-center mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              Save a Friend the Stress!
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-7">
              Do you know a classmate, relative, or family group waiting for their GCE results? Don't let them download huge PDFs. Share this link and let them check their results in seconds!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  "Check your Cameroon GCE results instantly by name without downloading massive PDFs! Visit https://klarifypath.com/gce-results"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-semibold text-sm py-3 px-6 rounded-xl transition-colors"
              >
                <Share2 size={16} />
                Share on WhatsApp
              </a>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm py-3 px-6 rounded-xl transition-colors"
              >
                {copied ? (
                  <><Check size={16} className="text-green-400" /> Link Copied!</>
                ) : (
                  <><Copy size={16} /> Copy Share Link</>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-4 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <FAQBlock faqs={gceFaqs} title="Cameroon GCE Result FAQs" />
        </div>
      </section>
    </Layout>
  );
};

export default GceResults;

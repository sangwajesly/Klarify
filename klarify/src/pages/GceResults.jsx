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
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import FAQBlock from "../components/FAQBlock";
import { API_URL } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const GceResults = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [examType, setExamType] = useState("");
  const [examYear, setExamYear] = useState("2026");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const EXAM_TYPES = [
    { id: "", label: t("gceResults.tabs.all") },
    { id: "AL", label: t("gceResults.tabs.al") },
    { id: "OL", label: t("gceResults.tabs.ol") },
    { id: "TVEE-AL", label: t("gceResults.tabs.tveal") },
    { id: "TVEE-IL", label: t("gceResults.tabs.tveil") },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://klarifypath.com/gce-results");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchResults = async (searchQuery, year, type) => {
    if (searchQuery.trim().length < 3) {
      setError(t("gceResults.minCharsError"));
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
      return result.exam_type === "OL" || result.exam_type === "TVEE-IL";
    }
    const resultStr = JSON.stringify(result).toLowerCase();
    return (
      resultStr.includes("o-level") ||
      resultStr.includes("ordinary level") ||
      resultStr.includes("o/l")
    );
  };

  const gceSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cameroon GCE Results Search Engine",
    description:
      "Instantly search and find your Cameroon General Certificate of Education (GCE) Ordinary and Advanced Level results.",
    url: "https://www.klarifypath.com/gce-results",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.klarifypath.com/gce-results?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const gceFaqs = [
    { question: t("gceResults.faqs.0.q"), answer: t("gceResults.faqs.0.a") },
    { question: t("gceResults.faqs.1.q"), answer: t("gceResults.faqs.1.a") },
    { question: t("gceResults.faqs.2.q"), answer: t("gceResults.faqs.2.a") },
    { question: t("gceResults.faqs.3.q"), answer: t("gceResults.faqs.3.a") },
    { question: t("gceResults.faqs.4.q"), answer: t("gceResults.faqs.4.a") },
  ];

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="Check Cameroon GCE Results Instantly | Klarify"
        description="Search your name to instantly check your Cameroon GCE Ordinary and Advanced Level results. No PDF downloads required. Find your results and get university recommendations."
        canonicalUrl="https://www.klarifypath.com/gce-results"
        structuredData={gceSchema}
      />

      <main className="bg-slate-50 dark:bg-slate-950 min-h-screen selection:bg-orange-500/30">
        {/* ── Search Engine Hero Section ── */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-700/60 pt-8 pb-16 md:pt-12 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest mb-8 border border-orange-100">
                <Search size={14} />
                {t("gceResults.badge")}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                {t("gceResults.heading")}{" "}
                <span className="text-orange-500 block sm:inline">{t("gceResults.headingHighlight")}</span>
              </h1>
              
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                {t("gceResults.subtext")}
              </p>

              {/* Form container */}
              <div className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 dark:border-slate-700 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 overflow-x-auto w-full pb-3 md:pb-4 hide-scrollbar justify-start sm:justify-center border-b border-slate-100 dark:border-slate-800 mb-3 md:mb-4 px-2">
                  {EXAM_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleTabChange(type.id)}
                      className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                        examType === type.id
                          ? "bg-slate-900 text-white"
                          : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white dark:text-white"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t("gceResults.searchPlaceholder")}
                      className="w-full pl-13 pr-6 py-4 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-base focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative w-32 shrink-0">
                      <select
                        value={examYear}
                        onChange={(e) => setExamYear(e.target.value)}
                        className="w-full appearance-none pl-6 pr-10 py-4 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer"
                      >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 sm:flex-initial px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <span>Search</span>}
                    </button>
                  </div>
                </form>
                {error && <p className="text-red-500 mt-3 text-sm text-center font-semibold">{error}</p>}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Results Listing ── */}
        <section className="py-12 md:py-16 px-6 md:px-12 max-w-4xl mx-auto min-h-[40vh]">
          {searched && !loading && results.length === 0 && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm">
              <Search className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {t("gceResults.noResults", { query, year: examYear })}
              </p>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {t("gceResults.noResultsHint")}
              </p>
            </motion.div>
          )}

          <div className="space-y-6">
            {results.map((result, idx) => (
              <motion.article
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={result.id}
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:border-slate-600 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 text-slate-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 truncate">
                      {result.candidate_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Building2 size={14} />
                        {result.center_number}
                      </span>
                      <span className="truncate max-w-[200px] sm:max-w-none">{result.center_name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:gap-3 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{t("gceResults.passed")}</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">{result.passed_category}</div>
                  </div>
                  
                  {!isOLevelResult(result) ? (
                    <button
                      onClick={() => navigate("/flow")}
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
                    >
                      {t("gceResults.getOrientation")}
                      <GraduationCap size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/careers")}
                      className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
                    >
                      {t("gceResults.getOrientation")}
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── Content below ── */}
        <section className="bg-white dark:bg-slate-900 py-24 px-6 md:px-12 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                { icon: Zap, title: t("gceResults.features.0.title"), body: t("gceResults.features.0.body") },
                { icon: Search, title: t("gceResults.features.1.title"), body: t("gceResults.features.1.body") },
                { icon: GraduationCap, title: t("gceResults.features.2.title"), body: t("gceResults.features.2.body") },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/60">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 mb-6 shadow-sm">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold mb-4">{t("gceResults.ctaHeading")}</h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">{t("gceResults.ctaSubtext")}</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      "Check your Cameroon GCE results instantly by name without downloading massive PDFs! Visit https://klarifypath.com/gce-results"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold px-8 py-4 rounded-full transition-colors"
                  >
                    <Share2 size={18} />
                    {t("gceResults.shareResult")}
                  </a>
                  
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:bg-slate-900/20 text-white font-bold px-8 py-4 rounded-full transition-colors"
                  >
                    {copied ? <><Check size={18} className="text-green-400" /> {t("gceResults.copied")}</> : <><Copy size={18} /> {t("gceResults.copyLink")}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 dark:bg-slate-950 py-24 px-6 md:px-12 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="max-w-3xl mx-auto">
            <FAQBlock faqs={gceFaqs} title={t("gceResults.faqHeading")} />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default GceResults;

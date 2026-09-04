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

      <main className="relative min-h-screen flex flex-col items-center pt-24 bg-slate-900 overflow-hidden">
        {/* Background — single consistent warm overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-40"
            style={{ backgroundImage: `url(${heroBg})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/90 via-slate-900/80 to-slate-900" />
        </div>

        {/* ── Main content ── */}
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center px-4 md:px-6">
          {/* Header */}
          <div className="w-full text-center mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/8 text-white text-xs font-medium backdrop-blur-sm">
              <span
                className="w-1.5 h-1.5 rounded-full bg-orange-400"
                aria-hidden="true"
              />
              {t("gceResults.badge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {t("gceResults.heading")}{" "}
              <span className="text-orange-400">
                {t("gceResults.headingHighlight")}
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-xl mx-auto">
              {t("gceResults.subtext")}
            </p>

            {/* Level filters - scrollable on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto w-full max-w-2xl mx-auto py-2 px-1 hide-scrollbar sm:justify-center">
              {EXAM_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTabChange(type.id)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    examType === type.id
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
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
              className="w-full max-w-3xl mx-auto mt-4"
              role="search"
            >
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Candidate Name Input - Full width on mobile */}
                <div className="relative flex-1 w-full">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("gceResults.searchPlaceholder")}
                    aria-label={t("gceResults.searchAriaLabel")}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Controls row on mobile: Year dropdown + Search button */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative w-28 sm:w-32 shrink-0">
                    <select
                      aria-label={t("gceResults.yearAriaLabel")}
                      value={examYear}
                      onChange={(e) => setExamYear(e.target.value)}
                      className="w-full appearance-none pl-3.5 pr-8 py-3.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm font-semibold text-center focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all cursor-pointer"
                    >
                      <option value="2026" className="text-slate-900 bg-white">
                        2026
                      </option>
                      <option value="2025" className="text-slate-900 bg-white">
                        2025
                      </option>
                      <option value="2024" className="text-slate-900 bg-white">
                        2024
                      </option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-initial px-6 py-3.5 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 shrink-0 cursor-pointer"
                    aria-label={t("gceResults.searchButton")}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Search size={16} className="sm:hidden" />
                        <span>{t("gceResults.searchButton")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  className="text-red-400 mt-3 text-sm text-center font-medium"
                  role="alert"
                >
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
                  {t("gceResults.noResults", { query, year: examYear })}
                </p>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  {t("gceResults.noResultsHint")}
                </p>
              </div>
            )}

            {results.map((result) => (
              <article
                key={result.id}
                className="bg-white/8 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10 hover:bg-white/12 transition-all duration-200 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0 w-full">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-500/15 rounded-lg shrink-0 mt-0.5">
                        <User
                          size={18}
                          className="text-orange-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug wrap-break-word">
                          {result.candidate_name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mt-1">
                          <Building2
                            size={14}
                            className="shrink-0 text-slate-400"
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {result.center_number} | {result.center_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto border border-orange-500/25 bg-orange-500/10 px-5 py-2.5 rounded-xl text-center shrink-0 sm:min-w-40">
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-orange-400 mb-0.5">
                      {t("gceResults.passed")}
                    </span>
                    <span className="block text-base sm:text-lg font-black text-white">
                      {result.passed_category}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/8 flex justify-start sm:justify-end">
                  {!isOLevelResult(result) ? (
                    <button
                      onClick={() => navigate("/flow")}
                      className="w-full sm:w-auto justify-center flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold text-xs sm:text-sm transition-colors py-2.5 px-4.5 sm:p-0 bg-white/5 sm:bg-transparent rounded-xl sm:rounded-none group/btn cursor-pointer"
                    >
                      {t("gceResults.getOrientation")}
                      <GraduationCap
                        size={16}
                        className="transition-transform duration-200 group-hover/btn:translate-x-1 shrink-0"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/careers")}
                      className="w-full sm:w-auto justify-center flex items-center gap-2 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-colors py-2.5 px-4.5 sm:p-0 bg-white/5 sm:bg-transparent rounded-xl sm:rounded-none group/btn cursor-pointer"
                    >
                      {t("gceResults.getOrientation")}
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-200 group-hover/btn:translate-x-1 shrink-0"
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
        <div className="max-w-6xl mx-auto">
          {/* Core highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {[
              {
                icon: Zap,
                title: t("gceResults.features.0.title"),
                body: t("gceResults.features.0.body"),
              },
              {
                icon: Search,
                title: t("gceResults.features.1.title"),
                body: t("gceResults.features.1.body"),
              },
              {
                icon: GraduationCap,
                title: t("gceResults.features.2.title"),
                body: t("gceResults.features.2.body"),
              },
            ].map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center mb-4 shrink-0">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
              </article>
            ))}
          </div>

          {/* Share callout */}
          <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-8 md:p-10 text-center mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
              {t("gceResults.ctaHeading")}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-7">
              {t("gceResults.ctaSubtext")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  "Check your Cameroon GCE results instantly by name without downloading massive PDFs! Visit https://klarifypath.com/gce-results",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-semibold text-sm py-3 px-6 rounded-xl transition-colors"
              >
                <Share2 size={16} />
                {t("gceResults.shareResult")}
              </a>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm py-3 px-6 rounded-xl transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-400" />{" "}
                    {t("gceResults.copied")}
                  </>
                ) : (
                  <>
                    <Copy size={16} /> {t("gceResults.copyLink")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-4 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <FAQBlock faqs={gceFaqs} title={t("gceResults.faqHeading")} />
        </div>
      </section>
    </Layout>
  );
};

export default GceResults;

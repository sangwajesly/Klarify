import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  X,
  Building2,
  GraduationCap,
  BookOpen,
  Briefcase,
  Search,
  Sparkles,
  MapPin,
  ChevronRight,
  Laptop
} from "lucide-react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import FAQBlock from "../components/FAQBlock";
import heroBg from "../assets/hero.jpg";
import studentsCampus from "../assets/cameroon_secondary_students.png";
import uniAerial from "../assets/pexels-skylight-views-2151863365-36347347.jpg";
import studentsArtboard from "../assets/pexels-the-artboard-131151099-18346466.jpg";
import studentBeka from "../assets/pexels-addibeka-14660578.jpg";
import studentPraise from "../assets/pexels-praisetoby-praise-1226513-31533077.jpg";
import campusStudents from "../assets/students_campus.png";
import AnimatedMarqueeHero from "../components/AnimatedMarqueeHero";
import { trackEvent } from "../utils/analytics";
import { fetchFeaturedInstitutions } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  // Only display the promotional GCE Results banner during the annual Cameroon GCE release season (Mid-July to end of August)
  const isGceSeason = () => {
    const now = new Date();
    const month = now.getMonth(); // 0-indexed: 6 = July, 7 = August
    const day = now.getDate();
    // Mid-July (July 15) through end of August (August 31)
    if (month === 6 && day >= 15) return true;
    if (month === 7) return true;
    return false;
  };

  const [showGceBanner, setShowGceBanner] = useState(() => {
    if (!isGceSeason()) return false;
    return localStorage.getItem("dismissedGceBanner") !== "true";
  });
  const [featuredUnis, setFeaturedUnis] = useState([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchFeaturedInstitutions();
        setFeaturedUnis(data);
      } catch (err) {
        console.error("Error loading featured institutions on home:", err);
      }
    };
    loadFeatured();
  }, []);

  const handleDismissGceBanner = () => {
    localStorage.setItem("dismissedGceBanner", "true");
    setShowGceBanner(false);
  };

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Klarify",
    url: "https://www.klarifypath.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.klarifypath.com/gce-results?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    description:
      "Klarify is an academic and career guidance platform focused on Cameroon. Get A-Level university program recommendations and GCE result searches.",
  };

  const homeFaqs = [
    { question: t("home.faqs.0.q"), answer: t("home.faqs.0.a") },
    { question: t("home.faqs.1.q"), answer: t("home.faqs.1.a") },
    { question: t("home.faqs.2.q"), answer: t("home.faqs.2.a") },
    { question: t("home.faqs.3.q"), answer: t("home.faqs.3.a") },
    { question: t("home.faqs.4.q"), answer: t("home.faqs.4.a") },
  ];

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="Klarify - University & Career Guidance in Cameroon"
        description="Discover the best university programs and career paths in Cameroon. Use our orientation recommender based on your A-Level subjects and interests. Check GCE results instantly."
        canonicalUrl="https://www.klarifypath.com"
        structuredData={homeSchema}
      />

      <main className="bg-slate-50 dark:bg-slate-950 selection:bg-primary-500/30">
        {/* ── GCE Banner ── */}
        {showGceBanner && (
          <div className="bg-slate-900 text-white relative z-50 border-b border-slate-800 px-6 md:px-12">
            <div className="max-w-7xl mx-auto py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                </span>
                <p className="text-sm font-medium text-slate-300">
                  <span className="md:hidden">{t("home.gceBanner.short")}</span>
                  <span className="hidden md:inline">{t("home.gceBanner.long")}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/gce-results")}
                  className="text-xs font-bold bg-primary-500 text-white px-4 py-1.5 rounded-full hover:bg-primary-600 transition-colors"
                  aria-label={t("home.gceBanner.searchNow")}
                >
                  {t("home.gceBanner.searchNow")}
                </button>
                <button
                  onClick={handleDismissGceBanner}
                  type="button"
                  className="p-1.5 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                  aria-label="Dismiss banner"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Animated Marquee Hero ── */}
        <AnimatedMarqueeHero
          tagline={t("home.badge")}
          taglineIcon={Sparkles}
          title={
            <>
              <span className="block text-slate-900 dark:text-white">
                {t("home.headline")}
              </span>
              <span className="block text-primary-500 dark:text-secondary-400 italic font-black mt-1 sm:mt-1.5">
                {t("home.headlineHighlight")}
              </span>
            </>
          }
          description={t("home.subtext")}
          ctaText={t("home.ctaPrimary")}
          onCtaClick={() => {
            trackEvent("cta_click", { location: "hero_primary" });
            navigate("/flow");
          }}
          images={[
            heroBg,
            studentsCampus,
            uniAerial,
            studentsArtboard,
            studentBeka,
            studentPraise,
            campusStudents,
          ]}
        />

        {/* ── Editorial About (Matching Brand Mockup) ── */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-[#E9EBF4]/60 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800 transition-colors">
          <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
            {/* Top Row: Heading + Paragraph 1 + Solid Brand Blue Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Heading: Left Column */}
              <div className="lg:col-span-5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-500 dark:text-white leading-[1.12] tracking-tight">
                  {t("home.aboutSection.heading")}
                </h2>
              </div>

              {/* Paragraph 1: Middle Column */}
              <div className="lg:col-span-4 flex items-center">
                <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {t("home.aboutSection.p1")}
                </p>
              </div>

              {/* Solid Blue Brand Block: Right Column */}
              <div className="lg:col-span-3 hidden sm:flex justify-end">
                <div className="w-full max-w-[240px] p-6 rounded-3xl bg-primary-500 dark:bg-primary-600 shadow-xl shadow-primary-500/20 text-white flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                  <img
                    src="/klarify-mark-white.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute -bottom-4 -right-4 w-28 h-28 opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-bold text-sky-10 uppercase tracking-wider">Accredited Base</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-400 animate-pulse" title="Active accreditation" />
                  </div>
                  <div className="relative z-10 mt-3">
                    <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">320+</div>
                    <p className="text-xs text-sky-11 font-medium mt-1.5 leading-snug">Cameroonian Programs & Concours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Large Student Photo (68%) + Paragraph 2 (32%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Main Student Showcase Image */}
              <div className="lg:col-span-8 overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/10">
                <img
                  src={studentsCampus}
                  alt="Cameroonian secondary school students"
                  className="w-full h-auto object-cover aspect-[16/10] hover:scale-[1.01] transition-transform duration-500"
                />
              </div>

              {/* Paragraph 2: Right Column */}
              <div className="lg:col-span-4">
                <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {t("home.aboutSection.p2")}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/flow")}
                    className="inline-flex items-center gap-2 text-primary-500 dark:text-secondary-400 font-bold hover:underline transition-all text-sm group cursor-pointer"
                  >
                    <span>Calculate your university matches</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ALX-Style "Explore Career Pathways" Section (The 3 Audience Forks) ── */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-primary-500 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Explore Your Next Path
              </h2>
              <p className="text-sky-11 text-sm sm:text-base mt-2 font-medium">
                Choose the journey that matches your stage: undergraduate, postgraduate, or market skill builder.
              </p>
            </div>

            {/* 3 Pure, Clean, Soft Pastel Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Soft Pastel Lime (Secondary School Leavers) */}
              <div
                onClick={() => {
                  sessionStorage.setItem('flow_persona', 'highschool');
                  navigate("/flow?step=2");
                }}
                className="p-8 rounded-[2rem] bg-[#E8EEAD] text-slate-900 flex flex-col justify-between min-h-[260px] shadow-lg shadow-black/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                        Secondary School Leavers
                      </span>
                      <h3 className="text-xl font-black text-slate-950 tracking-tight leading-snug">
                        Undergraduate & Concours
                      </h3>
                    </div>
                    <img
                      src={studentBeka}
                      alt="Secondary school graduate"
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white/80 shadow-xs shrink-0"
                    />
                  </div>
                  <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-medium">
                    Match your GCE A-Level combinations with verified university degree programs, professional concours (FMSB, ENSP, ENS), and polytechnics across Cameroon.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/10">
                  <span className="text-xs font-bold text-slate-900 group-hover:underline">
                    Find My Degree
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform shrink-0">
                    <ArrowRight size={15} className="stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Card 2: Soft Pastel Lavender/Sky (Bachelor's Degree Holders) */}
              <div
                onClick={() => {
                  sessionStorage.setItem('flow_persona', 'graduate');
                  navigate("/flow?step=2");
                }}
                className="p-8 rounded-[2rem] bg-[#E9EBF4] text-slate-900 flex flex-col justify-between min-h-[260px] shadow-lg shadow-black/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                        Bachelor's Graduates
                      </span>
                      <h3 className="text-xl font-black text-slate-950 tracking-tight leading-snug">
                        Master&apos;s & Postgraduates
                      </h3>
                    </div>
                    <img
                      src={studentPraise}
                      alt="Graduate student"
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white/80 shadow-xs shrink-0"
                    />
                  </div>
                  <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-medium">
                    Discover specialized master&apos;s degrees, professional postgraduate concours, and research tracks to elevate your academic and technical specialization.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/10">
                  <span className="text-xs font-bold text-slate-900 group-hover:underline">
                    Explore Master&apos;s Paths
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform shrink-0">
                    <ArrowRight size={15} className="stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Card 3: Crisp Soft White (Job Seekers & Self-Learners) */}
              <div
                onClick={() => {
                  sessionStorage.setItem('flow_persona', 'professional');
                  navigate("/flow?step=2");
                }}
                className="p-8 rounded-[2rem] bg-white text-slate-900 flex flex-col justify-between min-h-[260px] shadow-lg shadow-black/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                        Job Seekers & Self-Learners
                      </span>
                      <h3 className="text-xl font-black text-slate-950 tracking-tight leading-snug">
                        Skills & Career Gap Bridge
                      </h3>
                    </div>
                    <img
                      src={studentsArtboard}
                      alt="Professional skill builder"
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 shadow-xs shrink-0"
                    />
                  </div>
                  <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-medium">
                    Input your existing skills. Uncover your market gaps and get matched with certified bootcamps, courses, and verified remote or local Cameroon internships.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/10">
                  <span className="text-xs font-bold text-slate-900 group-hover:underline">
                    Assess My Skills
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-100 shadow-xs flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform shrink-0">
                    <ArrowRight size={15} className="stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Universities (Modern List) ── */}
        {featuredUnis.length > 0 && (
          <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-slate-900 text-white border-y border-slate-800">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {t("home.featured.heading")}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredUnis.map((uni) => (
                  <Link
                    to={`/universities/${encodeURIComponent(uni.name)}`}
                    key={uni.id}
                    className="group block p-6 sm:p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors" />
                    
                    <div className="relative z-10">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 mb-6 group-hover:text-secondary-400 group-hover:scale-110 transition-all duration-300">
                        <Building2 size={22} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-secondary-400 transition-colors">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
                        <MapPin size={14} />
                        {uni.city} &bull; {uni.campus || t("home.featured.campus")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Partner Advertisement ── */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950 rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                  {t("home.partnerPromo.title")}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg mb-6 leading-relaxed">
                  {t("home.partnerPromo.text")}
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => {
                      trackEvent("partner_cta_click", { location: "homepage_promo" });
                      navigate("/partners");
                    }}
                    className="px-6 sm:px-8 py-3.5 sm:py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    {t("home.partnerPromo.button")}
                  </button>
                  <Link
                    to="/partner/login"
                    onClick={() => trackEvent("partner_cta_click", { location: "homepage_promo_login" })}
                    className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold text-xs sm:text-sm transition-colors"
                  >
                    {t("home.partnerPromo.login")}
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative min-h-[380px]">
                <img
                  src={uniAerial}
                  alt="University aerial view"
                  className="absolute inset-0 w-full h-full object-cover grayscale-[10%]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <section className="py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-3xl mx-auto">
            <FAQBlock faqs={homeFaqs} title={t("home.faq.heading")} />
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary-500/15 via-transparent to-transparent" />
          
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
              {t("home.bottomCta.heading")}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("home.bottomCta.subtext")}
            </p>
            <button
              onClick={() => navigate("/flow")}
              className="inline-flex items-center gap-3 bg-secondary-500 hover:bg-secondary-400 text-slate-950 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-sm sm:text-base transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-secondary-500/25 cursor-pointer"
              aria-label={t("home.bottomCta.button")}
            >
              <span>{t("home.bottomCta.button")}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;

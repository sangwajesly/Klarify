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
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import FAQBlock from "../components/FAQBlock";
import heroBg from "../assets/hero.jpg";
import studentsCampus from "../assets/cameroon_secondary_students.png";
import uniAerial from "../assets/pexels-skylight-views-2151863365-36347347.jpg";
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
  const { t } = useLanguage();
  const [showGceBanner, setShowGceBanner] = useState(() => {
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

      <main className="bg-slate-50 dark:bg-slate-950 selection:bg-orange-500/30">
        {/* ── GCE Banner ── */}
        {showGceBanner && (
          <div className="bg-slate-900 text-white relative z-50 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
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
                  className="text-xs font-bold bg-orange-500 text-white px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors"
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

        {/* ── Editorial Hero ── */}
        <section className="relative pt-8 pb-20 md:pt-12 md:pb-32 overflow-hidden bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
              
              {/* Hero Content */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-2xl"
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest mb-8">
                  <Sparkles size={14} className="text-orange-500" />
                  {t("home.badge")}
                </motion.div>
                
                <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                  {t("home.headline")}{" "}
                  <span className="text-orange-500">{t("home.headlineSub")}</span>
                </motion.h1>
                
                <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
                  {t("home.subtext")}
                </motion.p>
                
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-5">
                  <button
                    onClick={() => navigate("/flow")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t("home.ctaPrimary")}
                    <ArrowRight size={18} />
                  </button>
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {t("home.ctaSubtext")}
                  </span>
                </motion.div>
              </motion.div>

              {/* Hero Image / Composition */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="relative hidden lg:block"
              >
                {/* Decorative background shape */}
                <div className="absolute inset-0 -translate-x-8 translate-y-8 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
                
                {/* Main Image */}
                <img 
                  src={heroBg} 
                  alt="Student focused on career" 
                  className="relative z-10 w-full h-[600px] object-cover rounded-3xl shadow-2xl shadow-slate-900/10 grayscale-[20%]"
                />
                
                {/* Floating UI Element to show "Tech" aspect without generic icons */}
                <div className="absolute -bottom-6 -left-8 z-20 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800 max-w-[240px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matched</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">BSc. Computing</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 w-[92%] h-full rounded-full" />
                  </div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium text-right">92% Match Score</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Editorial About ── */}
        <section className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <img
                  src={studentsCampus}
                  alt="Cameroonian secondary school students"
                  className="rounded-3xl shadow-xl w-full h-auto object-cover aspect-[4/3] grayscale-[10%]"
                />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
              </div>
              <div className="order-1 lg:order-2">
                <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                  {t("home.aboutSection.eyebrow")}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
                  {t("home.aboutSection.heading")}
                </h2>
                <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  <p>{t("home.aboutSection.p1")}</p>
                  <p>{t("home.aboutSection.p2")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bento Grid Features ── */}
        <section className="py-24 px-6 md:px-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                {t("home.whySection.eyebrow")}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("home.whySection.heading")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 - Large spanning */}
              <div className="md:col-span-2 bg-slate-50 dark:bg-slate-950 rounded-3xl p-10 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden relative group">
                <div className="relative z-10 max-w-md">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-slate-900 dark:text-white mb-6">
                    <Search size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t("home.whySection.card1.title")}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t("home.whySection.card1.description")}
                  </p>
                </div>
                {/* Decorative element replacing generic icon pattern */}
                <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 translate-x-1/4 translate-y-1/4">
                  <Search size={240} />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/10 dark:bg-slate-900/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm border border-white/10">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{t("home.whySection.card2.title")}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {t("home.whySection.card2.description")}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-orange-500 rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 dark:bg-slate-900/20 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm border border-white/20">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{t("home.whySection.card3.title")}</h3>
                  <p className="text-orange-50 leading-relaxed text-sm">
                    {t("home.whySection.card3.description")}
                  </p>
                </div>
              </div>
              
              {/* Feature 4 - New span */}
              <div className="md:col-span-2 bg-slate-50 dark:bg-slate-950 rounded-3xl p-10 border border-slate-200/60 dark:border-slate-700/60 flex flex-col md:flex-row items-center gap-8 hover:border-orange-500/30 transition-colors group">
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block group-hover:text-orange-500 transition-colors">How it works</span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t("home.features.step2.title")}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t("home.features.step2.description")}
                  </p>
                </div>
                <div className="shrink-0">
                  <button onClick={() => navigate('/flow')} className="w-14 h-14 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Universities (Modern List) ── */}
        {featuredUnis.length > 0 && (
          <section className="py-24 bg-slate-900 text-white border-y border-slate-800">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                  <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                    {t("home.featured.label")}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                    {t("home.featured.heading")}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredUnis.map((uni) => (
                  <Link
                    to={`/universities/${encodeURIComponent(uni.name)}`}
                    key={uni.id}
                    className="group block p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
                    
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-300 mb-8 group-hover:text-orange-400 group-hover:scale-110 transition-all duration-300">
                        <Building2 size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
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
        <section className="py-24 px-6 md:px-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 md:p-20 flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                  {t("home.partnerPromo.title")}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                  {t("home.partnerPromo.text")}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      trackEvent("partner_cta_click", { location: "homepage_promo" });
                      navigate("/partners");
                    }}
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition-colors"
                  >
                    {t("home.partnerPromo.button")}
                  </button>
                  <Link
                    to="/partner/login"
                    onClick={() => trackEvent("partner_cta_click", { location: "homepage_promo_login" })}
                    className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold transition-colors"
                  >
                    {t("home.partnerPromo.login")}
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative min-h-[400px]">
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
        <section className="py-24 px-6 md:px-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-3xl mx-auto">
            <FAQBlock faqs={homeFaqs} title={t("home.faq.heading")} />
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-32 px-6 md:px-12 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
          
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              {t("home.bottomCta.heading")}
            </h2>
            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("home.bottomCta.subtext")}
            </p>
            <button
              onClick={() => navigate("/flow")}
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-orange-500/20"
              aria-label={t("home.bottomCta.button")}
            >
              {t("home.bottomCta.button")}
              <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;

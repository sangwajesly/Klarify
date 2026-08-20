import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Target, Zap, ShieldCheck, ArrowRight, X, Building2 } from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import FAQBlock from "../components/FAQBlock";
import heroBg from "../assets/hero.jpg";
import studentsCampus from "../assets/cameroon_secondary_students.png";
import uniAerial from "../assets/pexels-skylight-views-2151863365-36347347.jpg";
import { trackEvent } from "../utils/analytics";
import { fetchFeaturedInstitutions } from "../services/api";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <article className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition-colors duration-200 hover:-translate-y-0.5 transform">
    <div
      className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center mb-5"
      aria-hidden="true"
    >
      <Icon size={20} />
    </div>
    <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
  </article>
);

const StepComponent = ({ number, title, description }) => (
  <article className="flex flex-col items-center text-center">
    <div className="mb-5" aria-hidden="true">
      <span className="block text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-1">
        Step
      </span>
      <span className="block text-5xl font-extrabold text-slate-200 leading-none">
        {String(number).padStart(2, "0")}
      </span>
    </div>
    <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </article>
);

const Home = () => {
  const navigate = useNavigate();
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
    name: "KlarifyPath",
    url: "https://www.klarifypath.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.klarifypath.com/gce-results?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    description:
      "KlarifyPath is an academic and career guidance platform focused on Cameroon. Get A-Level university program recommendations and GCE result searches.",
  };

  const homeFaqs = [
    {
      question: "What is KlarifyPath?",
      answer:
        "KlarifyPath is an educational platform designed specifically for Cameroonian students. It helps A-Level students find the best university programs and career paths based on their subjects and interests.",
    },
    {
      question: "How do I choose a university program in Cameroon?",
      answer:
        "Choosing a program depends on your A-Level subjects, grades, and career interests. Our academic recommender analyzes your specific subject combination (e.g., Biology, Chemistry, Math) and matches you with eligible degrees in Cameroonian universities.",
    },
    {
      question: "Which programs require concours?",
      answer:
        "Many professional programs in Cameroon (like Medicine at FMSB, Engineering at ENSP, or Teaching at ENS) require a competitive entrance examination known as a 'concours'. KlarifyPath clearly labels which recommended programs require a concours.",
    },
    {
      question: "Which universities are public in Cameroon?",
      answer:
        "Cameroon has several state universities including the University of Buea, University of Bamenda, University of Yaounde I & II, University of Douala, University of Dschang, University of Maroua, and University of Ngaoundere. Our platform recommends programs across these institutions.",
    },
    {
      question: "Is KlarifyPath free to use?",
      answer:
        "Yes! Searching for GCE results and getting your initial career and university recommendations is completely free for all Cameroonian students.",
    },
  ];

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="KlarifyPath - University & Career Guidance in Cameroon"
        description="Discover the best university programs and career paths in Cameroon. Use our orientation recommender based on your A-Level subjects and interests. Check GCE results instantly."
        canonicalUrl="https://www.klarifypath.com"
        structuredData={homeSchema}
      />

      <main>
        {/* ── GCE Banner ── */}
        {showGceBanner && (
          <div className="bg-orange-600 text-white relative z-20">
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-2 w-2 shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                </span>
                <p className="text-sm font-medium truncate">
                  <span className="md:hidden">Check GCE Results</span>
                  <span className="hidden md:inline">
                    Check GCE Results Now.
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate("/gce-results")}
                  className="text-xs font-bold bg-white text-orange-600 px-3.5 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
                  aria-label="Search GCE Results"
                >
                  Search Now
                </button>
                <button
                  onClick={handleDismissGceBanner}
                  type="button"
                  className="p-1 rounded hover:bg-white/15 focus:outline-none transition-colors text-white/80 hover:text-white"
                  aria-label="Dismiss banner"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Hero ── */}
        <section className="relative min-h-[78vh] flex items-end md:items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroBg})` }}
              aria-hidden="true"
            />
            {/* Single warm overlay — no blue tint */}
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/80 via-slate-900/85 to-slate-900/95" />
            <div className="absolute inset-0 bg-linear-to-r from-orange-900/20 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 pb-16 pt-20 md:py-24">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/8 text-white text-xs font-medium mb-8 backdrop-blur-sm">
              <span
                className="w-1.5 h-1.5 rounded-full bg-orange-400"
                aria-hidden="true"
              />
              Cameroon's #1 Academic Guidance Platform
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 max-w-3xl leading-tight">
              Find Your Next Step{" "}
              <span className="text-orange-400 block sm:inline mt-2 sm:mt-0">
                After Secondary School or University
              </span>
            </h1>

            {/* Supporting copy */}
            <p className="text-base md:text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
              Stop guessing what comes next. Discover the perfect university
              programs, professional concours, and career paths in Cameroon
              tailored precisely to your unique profile and goals.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => navigate("/flow")}
                aria-label="Get Started"
                className="inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm py-3.5 px-7 rounded-xl shadow-lg shadow-orange-500/30 transition-colors duration-200"
              >
                Get Started Free
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <span className="text-slate-400 text-sm">
                Takes only 2 minutes &mdash; no credit card required.
              </span>
            </div>

            {/* Trust bar */}
            <div className="mt-10 pt-8 border-t border-white/10 flex items-center gap-3">
              <div className="flex text-orange-400 text-sm tracking-tight">
                ★★★★★
              </div>
              <span className="text-slate-300 text-sm">
                Trusted by <strong className="text-white">5,000+</strong>{" "}
                students
              </span>
            </div>
          </div>
        </section>

        {/* ── About KlarifyPath ── */}
        <section className="py-20 px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
              {/* Left: eyebrow + heading */}
              <div className="md:col-span-5">
                <span className="section-eyebrow block mb-3">
                  About KlarifyPath
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                  Cameroon's premier educational platform
                </h2>
              </div>
              {/* Right: body copy */}
              <div className="md:col-span-7 space-y-4 text-slate-600 text-base leading-relaxed">
                <p>
                  KlarifyPath is designed to bridge the gap between high school
                  education and career success. Every year, thousands of
                  Cameroonian students struggle to navigate the complex higher
                  education system.
                </p>
                <p>
                  We solve this by providing an intelligent, personalized
                  recommendation engine that analyzes your academic strengths
                  (like GCE A-Level subjects) and personal interests to suggest
                  the most appropriate public and private university programs,
                  concours, and career pathways in Cameroon.
                </p>
                <div className="mt-8">
                  <img
                    src={studentsCampus}
                    alt="Cameroonian secondary school students"
                    className="rounded-2xl shadow-xl w-full h-auto object-cover max-h-87.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="bg-slate-900 py-20 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="section-eyebrow block mb-3">
                Why KlarifyPath
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg">
                We take the guesswork out of your future
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FeatureCard
                icon={Target}
                title="Cameroon Specific"
                description="Our data is tailored exclusively to the Cameroonian education system, covering local state universities, private institutes, and national concours."
              />
              <FeatureCard
                icon={Zap}
                title="Personalized Matching"
                description="No more scrolling through endless prospectuses. Get tailored degree and career results instantly matched to your subjects."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Comprehensive Guidance"
                description="We don't just suggest degrees. We provide prerequisite information, concours requirements, and the skills you need to succeed."
              />
            </div>
          </div>
        </section>

        {/* ── Partner Advertisement ── */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto rounded-2xl p-8 md:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                Partner With Klarify
              </h3>
              <p className="text-slate-600 mb-4">
                List your institution, upload programs and tuition fees, and get
                matched to high-intent A-Level students with direct WhatsApp
                leads and priority placement.
              </p>
              <ul className="text-sm text-slate-600 space-y-2 mb-4">
                <li>• Easy self-serve campus onboarding</li>
                <li>• Display tuition fees and program details</li>
                <li>• Direct WhatsApp leads and program analytics</li>
              </ul>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    trackEvent("partner_cta_click", {
                      location: "homepage_promo",
                    });
                    navigate("/partners");
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold"
                >
                  Partner With Us
                </button>
                <Link
                  to="/partner/login"
                  onClick={() =>
                    trackEvent("partner_cta_click", {
                      location: "homepage_promo_login",
                    })
                  }
                  className="text-sm text-slate-700 hover:text-orange-500"
                >
                  Institution Login
                </Link>
              </div>
            </div>

            <div className="w-full md:w-80">
              <img
                src={uniAerial}
                alt="University aerial view"
                className="rounded-xl shadow-md w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── Featured Universities Showcase ── */}
        {featuredUnis.length > 0 && (
          <section className="py-12 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-black uppercase tracking-widest mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Featured Institutions
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                Premium Orientation Partners
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredUnis.map((uni) => (
                  <div
                    key={uni.id}
                    className="p-6 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-slate-850 flex flex-col justify-between hover:border-orange-500/30 hover:bg-slate-950 transition-all duration-200 group"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mb-4">
                        <Building2 size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {uni.city} &bull; {uni.campus || "Main Campus"}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800/80">
                      <Link
                        to={`/universities/${encodeURIComponent(uni.name)}`}
                        className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-white/10 transition-colors"
                      >
                        View Programs
                      </Link>
                      {uni.whatsapp_number && (
                        <a
                          href={`https://wa.me/${String(uni.whatsapp_number).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center shrink-0"
                          title="WhatsApp Admissions"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.273-3.838l.409.243c1.558.926 3.42 1.415 5.32 1.416 5.768 0 10.461-4.691 10.465-10.461.002-2.795-1.082-5.424-3.053-7.397S14.808 1.026 12.01 1.026c-5.772 0-10.465 4.693-10.469 10.464-.002 1.96.512 3.878 1.488 5.613l.273.487L2.316 21.8l3.864-.838z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── How It Works ── */}
        <section className="py-20 px-6 md:px-12 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 text-center">
              <span className="section-eyebrow block mb-3">How It Works</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                A simple, 3-step process
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
              {/* Connector line — between step numbers */}
              <div
                className="hidden md:block absolute top-9 left-[22%] right-[22%] h-px bg-slate-200 z-0"
                aria-hidden="true"
              />

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

        {/* ── Universities Covered ── */}
        <section className="py-20 px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="section-eyebrow block mb-3">Coverage</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Universities & Institutions Covered
              </h2>
              <p className="text-slate-500 text-base max-w-xl">
                Our recommendation engine includes programs from top
                institutions across the national territory.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "University of Buea",
                "University of Bamenda",
                "University of Yaounde I",
                "University of Yaounde II",
                "University of Douala",
                "University of Dschang",
                "University of Maroua",
                "University of Ngaoundere",
                "Professional Concours (ENS, ENSP, FMSB)",
              ].map((uni, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border-l-2 border-orange-400/50 border-t border-r border-b flex items-center text-sm font-medium text-slate-700"
                >
                  {uni}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <div className="bg-slate-50 py-4 px-6">
          <FAQBlock
            faqs={homeFaqs}
            title="Frequently Asked Questions About KlarifyPath"
          />
        </div>

        {/* ── Bottom CTA ── */}
        <section
          className="py-20 px-6 md:px-12 bg-orange-500 relative overflow-hidden"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 28px, rgba(255,255,255,0.04) 28px, rgba(255,255,255,0.04) 29px)",
          }}
        >
          {/* ── Partner Promo ── */}
          <section className="py-12 px-6 md:px-12 bg-slate-50">
            <div className="max-w-6xl mx-auto rounded-2xl bg-white p-6 md:p-8 border border-slate-200 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Reach students actively choosing programs
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  List your institution and academic programs on Klarify to get
                  matched with high-intent A-Level students. Display tuition,
                  campus, and receive direct WhatsApp leads.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => navigate("/partners")}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold"
                >
                  Partner With Us
                </button>
                <Link
                  to="/partner/login"
                  className="text-sm text-slate-700 hover:text-orange-500"
                >
                  Institution Login
                </Link>
              </div>
            </div>
          </section>

          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to find your path?
            </h2>
            <p className="text-orange-100 text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of Cameroonian students who have already discovered
              their ideal university programs and careers with KlarifyPath.
            </p>
            <button
              onClick={() => navigate("/flow")}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors hover:bg-slate-800 shadow-lg shadow-slate-900/30"
              aria-label="Start Your Free Assessment Now"
            >
              Start Your Free Assessment
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;

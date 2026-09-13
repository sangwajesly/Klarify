import React from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import {
  Heart,
  Lightbulb,
  Target,
  Users,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import heroBg from "../assets/hero.jpg";
import sangwaJesly from "../assets/Sangwa Jesly.jpg";
import desmondYembi from "../assets/Desmond Yembi.jpg";
const missJoyce = null;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const About = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Klarify",
    url: "https://www.klarifypath.com",
    logo: "https://www.klarifypath.com/favicon.svg",
    description:
      "Cameroon's premier educational platform for academic orientation, career guidance, and GCE result searching.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CM",
    },
  };

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="About Us - Our Mission for Cameroonian Education"
        description="Learn why Klarify was built. We are a team of Cameroonian students building the academic and career orientation tools we wish we had."
        canonicalUrl="https://www.klarifypath.com/about"
        structuredData={orgSchema}
      />

      <main className="bg-white dark:bg-slate-900 selection:bg-orange-500/30">
        {/* ── Editorial Hero Section ── */}
        <section className="relative pt-8 pb-20 md:pt-12 md:pb-24 overflow-hidden border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" aria-hidden="true" />
                {t("about.hero.badge")}
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
                {t("about.hero.title")}{" "}
                <span className="text-orange-500">{t("about.hero.titleHighlight")}</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                {t("about.hero.text")}{" "}
                <span className="text-slate-800 dark:text-slate-200 font-medium italic block mt-4">
                  "{t("about.hero.quote")}"
                </span>
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── Story Section (Editorial Asymmetry) ── */}
        <section className="py-24 px-6 md:px-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Column: Visual Story / Callout */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
                  <GraduationCap className="text-orange-500 mb-6" size={40} />
                  <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                    {t("about.mission.stat")}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    {t("about.mission.statText")}
                  </p>
                </div>
                
                <div className="rounded-[2.5rem] bg-slate-900 text-white p-10 relative overflow-hidden">
                  <p className="text-lg italic leading-relaxed text-slate-300 font-medium">
                    "{t("about.mission.quote")}"
                  </p>
                  <p className="text-orange-400 font-bold mt-6 tracking-wide uppercase text-sm">
                    — {t("about.mission.quoteAuthor")}
                  </p>
                </div>
              </div>

              {/* Right Column: Copy */}
              <div className="lg:col-span-7 lg:pl-8">
                <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                  {t("about.story.eyebrow")}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-8 tracking-tight">
                  {t("about.story.heading")}
                </h2>
                
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-lg">{t("about.story.p1")}</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-lg">
                    {t("about.story.p2")}{" "}
                    <span className="text-slate-900 dark:text-white font-medium">{t("about.story.concours")}</span>{" "}
                    {t("about.story.p2b")}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-lg">
                    {t("about.story.p3")}{" "}
                    <strong className="text-slate-900 dark:text-white">{t("about.story.p3Strong")}</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{t("about.story.p4")}</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Mission & Values (Bento Grid Style) ── */}
        <section className="bg-slate-50 dark:bg-slate-950 py-24 px-6 md:px-12 border-y border-slate-200/60 dark:border-slate-700/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                {t("about.values.eyebrow")}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                {t("about.values.heading")}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {t("about.values.text")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-700 hover:border-orange-500/30 transition-colors group">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white mb-6 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Clarity Over Confusion</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  We transform raw academic data (GCE subjects, interests, and grades) into clear, actionable paths. No jargon. No guesswork.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-700 hover:border-orange-500/30 transition-colors group">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white mb-6 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                  <Heart size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Empathy First</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  We've been those confused students. Every feature we build is shaped by lived experience, not assumptions.
                </p>
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 dark:bg-slate-900/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm border border-white/10">
                    <Target size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Local & Relevant</h3>
                  <p className="text-slate-400 leading-relaxed">
                    We are built specifically for Cameroon. Our programs database, Concours information, and recommendations are all locally curated.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-700 hover:border-orange-500/30 transition-colors group">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white mb-6 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                  <Users size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Community-Driven</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  From parents sharing GCE results links on WhatsApp to students using our orientation engine, Klarify grows because the community believes in it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Team Section (Editorial Profile Cards) ── */}
        <section className="bg-white dark:bg-slate-900 py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                {t("about.team.eyebrow")}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("about.team.heading1")} <br />
                <span className="text-slate-400 font-medium">
                  {t("about.team.heading2")}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sangwa Jesly */}
              <div className="group rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600 transition-all duration-300">
                <div className="aspect-[4/5] w-full relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    src={sangwaJesly}
                    alt="Sangwa Jesly"
                    className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sangwa Jesly</h3>
                  <p className="text-sm font-bold text-orange-500 uppercase tracking-wider mt-2 mb-4">
                    {t("about.team.sangwa.role")}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    Handles software development, brand architecture, and marketing designs for Klarify. Passionate about software engineering and educational accessibility.
                  </p>
                  <div className="inline-block px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400">
                    {t("about.team.sangwa.degree")}
                  </div>
                </div>
              </div>

              {/* Desmond Yembi */}
              <div className="group rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600 transition-all duration-300">
                <div className="aspect-[4/5] w-full relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    src={desmondYembi}
                    alt="Desmond Yembi"
                    className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Desmond Yembi</h3>
                  <p className="text-sm font-bold text-orange-500 uppercase tracking-wider mt-2 mb-4">
                    {t("about.team.desmond.role")}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    Directs program dataset modeling, concours ingestion pipelines, and recommendation logic databases. Focused on data systems scale and accuracy.
                  </p>
                  <div className="inline-block px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400">
                    B.Tech in Data Science
                  </div>
                </div>
              </div>

              {/* Miss Joyce */}
              <div className="group rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600 transition-all duration-300">
                <div className="aspect-[4/5] w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {missJoyce ? (
                    <img
                      src={missJoyce}
                      alt="Miss Joyce"
                      className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <span className="text-6xl font-extrabold text-slate-300 tracking-tight">MJ</span>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Miss Joyce</h3>
                  <p className="text-sm font-bold text-orange-500 uppercase tracking-wider mt-2 mb-4">
                    {t("about.team.joyce.role")}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    Manages community partnerships, student user feedback reviews, and runs orientation prediction models. Bridging the gap between code and students.
                  </p>
                  <div className="inline-block px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400">
                    B.Tech in Data Science
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What Klarify Does Section (Clean List) ── */}
        <section className="bg-slate-900 text-white py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                  {t("about.platform.eyebrow")}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                  {t("about.platform.heading")}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-10">
                  {t("about.platform.text")}
                </p>
                <button
                  onClick={() => navigate("/flow")}
                  className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105"
                >
                  {t("about.platform.cta")}
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    num: "01",
                    title: t("about.platform.cards.gce.title"),
                    desc: t("about.platform.cards.gce.desc"),
                  },
                  {
                    num: "02",
                    title: t("about.platform.cards.orientation.title"),
                    desc: t("about.platform.cards.orientation.desc"),
                  },
                  {
                    num: "03",
                    title: t("about.platform.cards.concours.title"),
                    desc: t("about.platform.cards.concours.desc"),
                  },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl flex gap-6 items-start hover:bg-slate-800 transition-colors">
                    <span className="text-2xl font-black text-slate-600 dark:text-slate-400 shrink-0 mt-1">{num}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                      <p className="text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default About;

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
import SEOHead from "../components/SEOHead";
import heroBg from "../assets/hero.jpg";
import sangwaJesly from "../assets/Sangwa Jesly.jpg";
import desmondYembi from "../assets/Desmond Yembi.jpg";
const missJoyce = null;

const ValueCard = ({ icon: Icon, title, description }) => (
  <article className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-start gap-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
      <Icon size={20} aria-hidden="true" />
    </div>
    <div>
      <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  </article>
);

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

      <main>
        {/* ── Hero Section (styled like Home/Partner Landing page) ── */}
        <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden py-24">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroBg})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/75 via-slate-900/85 to-slate-900/95" />
            <div className="absolute inset-0 bg-linear-to-r from-orange-900/10 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/6 text-white text-xs font-semibold mb-6 backdrop-blur-sm mx-auto">
              <span
                className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"
                aria-hidden="true"
              />
              {t("about.hero.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {t("about.hero.title")}
              <span className="text-orange-400 block sm:inline">
                {" "}
                {t("about.hero.titleHighlight")}
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t("about.hero.text")}{" "}
              <em className="text-white not-italic font-medium">
                {t("about.hero.quote")}
              </em>
            </p>
          </div>
        </section>

        {/* ── Origin Story Section (Full-width, White background) ── */}
        <section className="bg-white py-20 px-6 md:px-12 border-b border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div className="space-y-5">
                <span className="section-eyebrow text-orange-500 font-bold uppercase tracking-wider text-xs block">
                  {t("about.story.eyebrow")}
                </span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                  {t("about.story.heading")}
                </h2>
                <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
                  <p>{t("about.story.p1")}</p>
                  <p>
                    {t("about.story.p2")}{" "}
                    <em className="text-slate-800">
                      {t("about.story.concours")}
                    </em>{" "}
                    {t("about.story.p2b")}
                  </p>
                  <p>
                    {t("about.story.p3")}{" "}
                    <strong className="text-slate-900 font-bold">
                      {t("about.story.p3Strong")}
                    </strong>
                  </p>
                  <p>{t("about.story.p4")}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5 lg:pl-4">
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 md:p-8">
                  <GraduationCap
                    className="text-orange-500 mb-4"
                    size={36}
                    aria-hidden="true"
                  />
                  <p className="text-3xl font-extrabold text-slate-900 mb-2">
                    {t("about.mission.stat")}
                  </p>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    {t("about.mission.statText")}
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6">
                  <p className="text-slate-600 italic text-sm leading-relaxed">
                    {t("about.mission.quote")}
                  </p>
                  <p className="text-orange-500 font-semibold text-sm mt-3">
                    {t("about.mission.quoteAuthor")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission & Values Section (Full-width, Light gray background) ── */}
        <section className="bg-slate-50 py-20 px-6 md:px-12 border-b border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="section-eyebrow text-orange-500 font-bold uppercase tracking-wider text-xs block mb-2">
                {t("about.values.eyebrow")}
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                {t("about.values.heading")}
              </h2>
              <p className="text-slate-600 text-sm md:text-base mt-2 max-w-xl">
                {t("about.values.text")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ValueCard
                icon={Lightbulb}
                title="Clarity Over Confusion"
                description="We transform raw academic data (GCE subjects, interests, and grades) into clear, actionable paths. No jargon. No guesswork."
              />
              <ValueCard
                icon={Heart}
                title="Empathy First"
                description="We've been those confused students. Every feature we build is shaped by lived experience, not assumptions."
              />
              <ValueCard
                icon={Target}
                title="Local & Relevant"
                description="We are built specifically for Cameroon. Our programs database, Concours information, and recommendations are all locally curated."
              />
              <ValueCard
                icon={Users}
                title="Community-Driven"
                description="From parents sharing GCE results links on WhatsApp to students using our orientation engine, Klarify grows because the community believes in it."
              />
            </div>
          </div>
        </section>

        {/* ── Team Section (Full-width Dark Showcase Block) ── */}
        <section className="bg-slate-950 text-white py-24 px-6 md:px-12 relative overflow-hidden border-b border-slate-900">
          {/* Subtle background circular vector accent */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            aria-hidden="true"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 border border-slate-800 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border border-slate-800 rounded-full" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest font-black text-orange-400">
                {t("about.team.eyebrow")}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 leading-tight tracking-tight">
                {t("about.team.heading1")} <br />
                <span className="font-serif italic text-orange-400 font-normal lowercase tracking-wide block mt-1.5">
                  {t("about.team.heading2")}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Sangwa Jesly */}
              <article className="group relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10">
                {/* Photo */}
                <img
                  src={sangwaJesly}
                  alt="Sangwa Jesly"
                  className="absolute inset-0 w-full h-full object-cover grayscale-20 group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient Vignette overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Standard text display (bottom-left) */}
                <div className="absolute bottom-6 left-6 right-6 transition-all duration-500 group-hover:translate-y-4 group-hover:opacity-0">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Sangwa Jesly
                  </h3>
                  <p className="text-xs font-semibold text-orange-400 mt-1">
                    Co-Founder, Developer & Designer
                  </p>
                </div>

                {/* Hover active panel */}
                <div className="absolute inset-0 bg-indigo-955/95 backdrop-blur-xs p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {/* Tech grid style pattern */}
                  <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[20px_20px]" />

                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Sangwa Jesly
                    </h3>
                    <p className="text-xs font-semibold text-orange-400 mt-1">
                      {t("about.team.sangwa.role")}
                    </p>
                  </div>
                  <div className="relative z-10 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Handles software development, brand architecture, and
                      marketing designs for Klarify. Passionate about software
                      engineering and educational accessibility.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {t("about.team.sangwa.degree")}
                    </p>
                  </div>
                </div>
              </article>

              {/* Desmond Yembi */}
              <article className="group relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10">
                {/* Photo */}
                <img
                  src={desmondYembi}
                  alt="Desmond Yembi"
                  className="absolute inset-0 w-full h-full object-cover grayscale-20 group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient Vignette overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Standard text display (bottom-left) */}
                <div className="absolute bottom-6 left-6 right-6 transition-all duration-500 group-hover:translate-y-4 group-hover:opacity-0">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Desmond Yembi
                  </h3>
                  <p className="text-xs font-semibold text-orange-400 mt-1">
                    Co-Founder, Data Analyst & Engineer
                  </p>
                </div>

                {/* Hover active panel */}
                <div className="absolute inset-0 bg-indigo-955/95 backdrop-blur-xs p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[20px_20px]" />

                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Desmond Yembi
                    </h3>
                    <p className="text-xs font-semibold text-orange-400 mt-1">
                      {t("about.team.desmond.role")}
                    </p>
                  </div>
                  <div className="relative z-10 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Directs program dataset modeling, concours ingestion
                      pipelines, and recommendation logic databases. Focused on
                      data systems scale and accuracy.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      B.Tech in Data Science
                    </p>
                  </div>
                </div>
              </article>

              {/* Miss Joyce */}
              <article className="group relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10">
                {/* Photo or Initials Fallback */}
                {missJoyce ? (
                  <img
                    src={missJoyce}
                    alt="Miss Joyce"
                    className="absolute inset-0 w-full h-full object-cover grayscale-20 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-linear-to-br from-indigo-950/80 via-slate-900 to-orange-950/20 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-orange-400/80 tracking-widest font-serif">
                      MJ
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-2"></span>
                  </div>
                )}
                {/* Gradient Vignette overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-950/20 to-transparent" />

                {/* Standard text display (bottom-left) */}
                <div className="absolute bottom-6 left-6 right-6 transition-all duration-500 group-hover:translate-y-4 group-hover:opacity-0">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Miss Joyce
                  </h3>
                  <p className="text-xs font-semibold text-orange-400 mt-1">
                    {t("about.team.joyce.role")}
                  </p>
                </div>

                {/* Hover active panel */}
                <div className="absolute inset-0 bg-indigo-955/95 backdrop-blur-xs p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[20px_20px]" />

                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Miss Joyce
                    </h3>
                    <p className="text-xs font-semibold text-orange-400 mt-1">
                      Co-Founder, Data Scientist & Community Manager
                    </p>
                  </div>
                  <div className="relative z-10 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Manages community partnerships, student user feedback
                      reviews, and runs orientation prediction models. Bridging
                      the gap between code and students.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      B.Tech in Data Science
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* Slider visual cues mimicking screenshot */}
            <div className="mt-12 flex justify-center items-center gap-1.5 relative z-10">
              <div className="h-0.5 w-12 bg-orange-500 rounded-full" />
              <div className="h-0.5 w-6 bg-slate-800 rounded-full" />
              <div className="h-0.5 w-6 bg-slate-800 rounded-full" />
            </div>
          </div>
        </section>

        {/* ── What Klarify Does Section (Full-width, White background) ── */}
        <section className="bg-white py-20 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="section-eyebrow text-orange-500 font-bold uppercase tracking-wider text-xs block mb-2">
                {t("about.platform.eyebrow")}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {t("about.platform.heading")}
              </h2>
              <p className="text-slate-600 text-sm md:text-base mt-2">
                {t("about.platform.text")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                <article
                  key={num}
                  className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 hover:shadow-xs transition-shadow duration-200"
                >
                  <span className="block text-[10px] uppercase tracking-widest font-extrabold text-orange-500 mb-3">
                    {num}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </article>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => navigate("/flow")}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md shadow-orange-500/25"
                aria-label={t("about.platform.ctaAria")}
              >
                {t("about.platform.cta")}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default About;

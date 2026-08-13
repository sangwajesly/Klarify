import React from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { Heart, Lightbulb, Target, Users, ArrowRight, GraduationCap } from "lucide-react";
import SEOHead from "../components/SEOHead";
import heroBg from "../assets/hero.jpg";

const ValueCard = ({ icon: Icon, title, description }) => (
  <article className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition-colors duration-200 flex flex-col items-start gap-4">
    <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
      <Icon size={20} aria-hidden="true" />
    </div>
    <div>
      <h3 className="text-base font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  </article>
);

const About = () => {
  const navigate = useNavigate();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KlarifyPath",
    "url": "https://www.klarifypath.com",
    "logo": "https://www.klarifypath.com/favicon.svg",
    "description": "Cameroon's premier educational platform for academic orientation, career guidance, and GCE result searching.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CM"
    }
  };

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="About Us - Our Mission for Cameroonian Education"
        description="Learn why KlarifyPath was built. We are a team of Cameroonian students building the academic and career orientation tools we wish we had."
        canonicalUrl="https://www.klarifypath.com/about"
        structuredData={orgSchema}
      />

      <main>
        {/* ── Hero ── */}
        <section
          id="about"
          className="relative flex flex-col items-start justify-end min-h-[52vh] pt-32 pb-16 px-6 md:px-12 overflow-hidden bg-slate-900"
        >
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: `url(${heroBg})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/85 to-slate-900/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/15 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/8 text-white text-xs font-medium mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" aria-hidden="true" />
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 max-w-2xl">
              Built by Students,{" "}
              <span className="text-orange-400">For Students</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl">
              Klarify was born on results day — in the middle of the celebration, confusion, and the silent question nobody could answer:{" "}
              <em className="text-white not-italic font-medium">"What do I do next?"</em>
            </p>
          </div>
        </section>

        {/* ── Origin Story ── */}
        <section className="bg-slate-900 py-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div className="space-y-5">
                <span className="section-eyebrow">How It Started</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  The Confusion Nobody Talks About
                </h2>
                <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
                  <p>
                    Every year in Cameroon, thousands of students open their GCE results and feel two emotions at once: joy at passing, and sudden, overwhelming confusion about what comes next.
                  </p>
                  <p>
                    We were those students. A group of young people who, in the midst of the excitement and celebrations of GCE results day, found ourselves completely lost. We didn't know which university programs our subjects qualified us for. We didn't know which <em className="text-white">Concours</em> to sit. We didn't know which careers were actually realistic.
                  </p>
                  <p>
                    Some of us made rushed decisions. Some followed friends into programs that weren't right for them. Some are now studying things they never imagined — not because they chose poorly, but because <strong className="text-white">nobody gave them the right information at the right time.</strong>
                  </p>
                  <p>
                    That experience — that confusion in the middle of the celebration — is exactly why Klarify exists.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-orange-500/10 border border-orange-500/25 rounded-2xl p-7">
                  <GraduationCap className="text-orange-400 mb-4" size={32} aria-hidden="true" />
                  <p className="text-3xl font-extrabold text-white mb-2">2 in 3</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Cameroonian students end up in a university program they didn't originally want — not from lack of ambition, but lack of guidance at the critical moment.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-slate-300 italic text-sm leading-relaxed">
                    "We built the tool we desperately needed when we were 17 and staring at a GCE results PDF, wondering what our future looked like."
                  </p>
                  <p className="text-orange-400 font-semibold text-sm mt-3">— The Klarify Team</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission & Values ── */}
        <section className="bg-slate-950 py-20 px-6 md:px-12 border-t border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <span className="section-eyebrow block mb-3">What Drives Us</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg leading-tight">
                Our Mission & Values
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
                Everything we build is guided by a single belief — that every Cameroonian student deserves access to the right information at the right time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValueCard
                icon={Lightbulb}
                title="Clarity Over Confusion"
                description="We transform raw academic data — GCE subjects, interests, grades — into clear, actionable paths. No jargon. No guesswork."
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
                description="From parents sharing GCE results links on WhatsApp to students using our orientation engine — Klarify grows because the community believes in it."
              />
            </div>
          </div>
        </section>

        {/* ── What Klarify Does ── */}
        <section className="bg-slate-900 py-20 px-6 md:px-12 border-t border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <span className="section-eyebrow block mb-3">The Platform</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white max-w-lg">
                What Klarify Does
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-3 max-w-xl">
                We are building Cameroon's most comprehensive academic orientation and results platform — one feature at a time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                {
                  num: "01",
                  title: "GCE Results Search",
                  desc: "Search your GCE O/L, A/L, and TVE results instantly by name — no PDFs, no stress.",
                },
                {
                  num: "02",
                  title: "Academic Orientation",
                  desc: "Based on your A-Level subjects and interests, get personalized university program recommendations built for Cameroon's education system.",
                },
                {
                  num: "03",
                  title: "Concours & Career Guides",
                  desc: "Get details on entrance exams, deadlines, fees, and the career paths that each program leads to — all in one place.",
                },
              ].map(({ num, title, desc }) => (
                <article
                  key={num}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <span className="block text-[10px] uppercase tracking-widest font-bold text-orange-400 mb-3">
                    {num}
                  </span>
                  <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </article>
              ))}
            </div>

            <div>
              <button
                onClick={() => navigate("/flow")}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-200"
                aria-label="Start Your Free Assessment"
              >
                Start Your Free Assessment
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

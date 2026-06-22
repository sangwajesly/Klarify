import React from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { Heart, Lightbulb, Target, Users, ArrowRight, GraduationCap } from "lucide-react";
import heroBg from "../assets/hero.jpg";

const ValueCard = ({ icon: Icon, title, description }) => (
  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-600/60 flex flex-col items-start gap-4 hover:border-orange-500/40 hover:bg-slate-800/90 transition-all shadow-sm">
    <div className="w-12 h-12 rounded-xl bg-orange-500/25 text-orange-300 flex items-center justify-center shrink-0">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-200 leading-relaxed">{description}</p>
    </div>
  </div>
);

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout noPadding={true}>
      {/* Hero Section */}
      <section id="about" className="relative flex flex-col items-center justify-center min-h-[55vh] pt-28 pb-20 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/95 via-slate-900/90 to-slate-900/95" />
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-blue-500/10 opacity-80" />
          <div className="absolute top-20 -left-40 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Built by Students,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              For Students
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Klarify was born on results day — in the middle of the celebration, confusion, and the silent question nobody could answer: <em className="text-white font-medium">"What do I do next?"</em>
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="bg-slate-900 py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Text */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-black text-orange-400">How It Started</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                The Confusion Nobody Talks About
              </h2>
              <div className="space-y-4 text-slate-300 text-base leading-relaxed">
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

            {/* Statistic / Highlight Block */}
            <div className="flex flex-col gap-5">
              <div className="bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
                <div className="relative z-10">
                  <GraduationCap className="text-orange-400 mb-4" size={40} />
                  <p className="text-4xl font-black text-white mb-2">2 in 3</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Cameroonian students end up in a university program they didn't originally want — not from lack of ambition, but lack of guidance at the critical moment.
                  </p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <p className="text-slate-300 italic text-sm leading-relaxed">
                  "We built the tool we desperately needed when we were 17 and staring at a GCE results PDF, wondering what our future looked like."
                </p>
                <p className="text-orange-400 font-bold text-sm mt-3">— The Klarify Team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-slate-950 py-20 px-6 md:px-12 border-t border-slate-700">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest font-black text-orange-400">What Drives Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4">Our Mission & Values</h2>
            <p className="text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Everything we build is guided by a single belief — that every Cameroonian student deserves access to the right information at the right time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* What Klarify Offers */}
      <section className="bg-slate-900 py-20 px-6 md:px-12 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest font-black text-orange-400">The Platform</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4">What Klarify Does</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We are building Cameroon's most comprehensive academic orientation and results platform — one feature at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                <span className="text-2xl font-black">1</span>
              </div>
              <h3 className="font-bold text-white mb-2">GCE Results Search</h3>
              <p className="text-sm text-slate-400">Search your GCE O/L, A/L, and TVE results instantly by name — no PDFs, no stress.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                <span className="text-2xl font-black">2</span>
              </div>
              <h3 className="font-bold text-white mb-2">Academic Orientation</h3>
              <p className="text-sm text-slate-400">Based on your A/L subjects and interests, get personalized university program recommendations built for Cameroon's education system.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                <span className="text-2xl font-black">3</span>
              </div>
              <h3 className="font-bold text-white mb-2">Concours & Career Guides</h3>
              <p className="text-sm text-slate-400">Get details on entrance exams, deadlines, fees, and the career paths that each program leads to — all in one place.</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/flow")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg shadow-orange-500/25 transform hover:scale-105"
            >
              Start Your Free Assessment
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

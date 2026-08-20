import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";

const AlevelOrientationGuide = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState("science");

  const combinations = {
    science: {
      title: "Science Stream (PCM, MCB, PMCs, etc.)",
      description: "Passed Mathematics, Physics, Chemistry, or Biology? Your options are usually technical, medical, or research-based.",
      options: [
        { name: "Medicine & Health Sciences", details: "Requires Biology & Chemistry. If you passed these, you can sit for the National Medical Exams or apply for Nursing / Medical Lab degrees directly." },
        { name: "Engineering & Tech", details: "Requires Mathematics & Physics. Perfect for Computer Engineering, Electrical Engineering, or Software Engineering." },
        { name: "General Sciences", details: "Chemistry, Biochemistry, or Physics degrees. Offered as direct entry at state universities." },
      ],
    },
    commercial: {
      title: "Commercial Stream (Eco, Accounting, Maths, etc.)",
      description: "Economics, Accounting, and Business Management passes set you up for management, finance, and logistics.",
      options: [
        { name: "Accounting & Finance", details: "Direct entry in major public and private campuses. Always a high-demand career path." },
        { name: "Business Administration", details: "Covers management, human resources, and marketing." },
        { name: "Logistics & Supply Chain", details: "Douala and Limbe ports create thousands of logistics jobs. HND programs are popular here." },
      ],
    },
    arts: {
      title: "Arts & Humanities (LIT, HIS, PHI, etc.)",
      description: "Literature, History, and Philosophy passes prepare you for communication, law, administration, and letters.",
      options: [
        { name: "English Common Law", details: "Highly respected pathway at University of Buea and University of Bamenda. No concours needed." },
        { name: "Journalism & Mass Communication", details: "Great for writing and public speaking. Offers paths into media, PR, and advertising." },
        { name: "Bilingual Letters / Linguistics", details: "Perfect if you pass French and English. Opens doors to translation and teaching careers." },
      ],
    },
  };

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="What Can I Study After A-Level in Cameroon? | KlarifyPath"
        description="Learn how to choose university programs based on your A-Level subjects. Read our science, arts, and commercial orientation guides."
        canonicalUrl="https://www.klarifypath.com/guides/what-to-study-after-alevel"
      />

      {/* Hero Header */}
      <section className="bg-slate-950 text-white border-b border-slate-900 pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl mx-auto z-10 relative">
          <Link
            to="/guides"
            className="inline-flex items-center gap-1.5 text-xs text-orange-400 font-bold uppercase tracking-widest mb-6 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Educational Guides
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4">
            What Can I Study After A-Level in Cameroon?
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>By Hannah Frank</span>
            <span>&bull;</span>
            <span>5 min read</span>
          </div>
        </div>
      </section>

      {/* Clean Single-Column Reading Body (Medium style) */}
      <article className="bg-white py-12 px-6">
        <div className="max-w-2xl mx-auto text-slate-700 text-base sm:text-lg leading-relaxed space-y-6">
          <p>
            You just passed your Advanced Level. Congrats! You worked hard for those grades, and now you have your GCE slip in hand.
          </p>
          <p>
            But now comes the real questions: <em className="text-slate-900 font-bold">"Where do I apply? What course should I study?"</em>
          </p>
          <p>
            In Cameroon, it's easy to just follow what your friends are doing or choose a course because the name sounds fancy. But your A-Level subject combination is actually a map. If you follow it, it tells you exactly where you can go.
          </p>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-6">
            1. Every Faculty Has Its Own Keys
          </h2>
          <p>
            Universities in Cameroon have clear rules for who they accept. You can't just apply for any course. Your Advanced Level passes are like keycards:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm sm:text-base">
            <li>To study <strong className="text-slate-800">Engineering</strong>, you need Math and Physics.</li>
            <li>To study <strong className="text-slate-800">Medicine or Nursing</strong>, you need Biology and Chemistry.</li>
            <li>To study <strong className="text-slate-800">Management or Economics</strong>, you need Economics or Mathematics.</li>
            <li>To study <strong className="text-slate-800">Law</strong>, you usually need Literature in English.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-6">
            2. Match Your Combinations
          </h2>
          <p>
            Let's see what your stream qualifies you to study. Click your general stream below to see where you fit:
          </p>

          {/* Clean Combination selector */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 my-6">
            <div className="flex gap-2 border-b border-slate-255 pb-3 mb-4 overflow-x-auto">
              {Object.keys(combinations).map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedGroup === group
                      ? "bg-slate-950 text-white"
                      : "bg-slate-200/60 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm">{combinations[selectedGroup].title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{combinations[selectedGroup].description}</p>
              
              <div className="space-y-3">
                {combinations[selectedGroup].options.map((opt, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-slate-200/60 rounded-xl">
                    <strong className="text-slate-950 text-xs sm:text-sm block mb-0.5">{opt.name}</strong>
                    <p className="text-xs text-slate-500 leading-relaxed">{opt.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-6">
            3. Three Things to Check Before Choosing
          </h2>
          <p>
            Before you submit your admission papers, ask yourself these three basic questions:
          </p>
          <div className="space-y-4 text-sm sm:text-base">
            <p>
              <strong>🎒 Is it a Concours or Direct Entry?</strong> <br />
              Some schools require a separate entrance exam (concours) which is highly competitive. Always have a "direct entry" backup plan (a course you can get into immediately with just your GCE slip) so you don't waste a year.
            </p>
            <p>
              <strong>💸 Can we afford the tuition?</strong> <br />
              Public state universities cost 50,000 XAF a year, but private colleges and professional HND programs are more expensive. Talk to your family about the budget early.
            </p>
            <p>
              <strong>💼 Are there jobs?</strong> <br />
              Don't just choose a course because it sounds prestigious. Research if companies in Cameroon are actually hiring for that role, or if you can use the degree to start your own business.
            </p>
          </div>

          {/* Clean Inline CTA */}
          <div className="my-8 p-6 bg-orange-50 border border-orange-200 rounded-2xl">
            <h4 className="font-bold text-slate-900 text-base">Unsure about your GCE combinations?</h4>
            <p className="text-sm text-slate-600 mt-1">
              Use Klarify's free Academic Recommender to match your subjects and grades to suitable courses in Buea, Bamenda, Douala, and Yaounde.
            </p>
            <button
              onClick={() => navigate("/flow")}
              className="mt-4 inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Match My Subjects Free
              <ArrowRight size={14} />
            </button>
          </div>

          <p>
            Remember: Your A-Level results are just the starting block. It doesn't matter if you got 5 A's or 2 E's, what matters is that you choose a path where you can actually grow, learn, and build a career.
          </p>

          {/* Bottom CTA block */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Orientation Tool</p>
              <h4 className="font-extrabold text-slate-900 text-base mt-0.5">Let Klarify help you explore your options</h4>
            </div>
            <button
              onClick={() => navigate("/flow")}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Start Subject Assessment &rarr;
            </button>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default AlevelOrientationGuide;

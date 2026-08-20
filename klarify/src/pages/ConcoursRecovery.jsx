import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";

const ConcoursRecovery = () => {
  const navigate = useNavigate();

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="Failed a Concours in Cameroon? What to Do Next | KlarifyPath"
        description="Not making it into your dream school this year does not mean your future is over. Read our simple, honest advice on what you can study next."
        canonicalUrl="https://www.klarifypath.com/guides/failed-concours-what-next"
      />

      {/* Guide Header Banner */}
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
            Failed a Concours? Here's What to Do Next
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>By Hannah Frank</span>
            <span>&bull;</span>
            <span>6 min read</span>
          </div>
        </div>
      </section>

      {/* Clean Single-Column Reading Body (Medium style) */}
      <article className="bg-white py-12 px-6">
        <div className="max-w-2xl mx-auto text-slate-700 text-base sm:text-lg leading-relaxed space-y-6">
          <p>
            You prepared. You studied past papers. You sat for the entrance exam. You imagined yourself wearing the uniform, walking through the campus, or finally joining the school you had always wanted.
          </p>
          <p>Then the results came out.</p>
          <p className="font-bold text-slate-900">Your name wasn't there.</p>
          <p>
            Suddenly, you feel lost. You don't know what to tell your parents, you don't know what to tell your friends, and worse, you don't know what you're going to do next.
          </p>
          <p>
            If this is you, take a deep breath. 
          </p>

          <blockquote className="border-l-4 border-orange-500 pl-4 italic text-slate-800 font-medium my-8">
            "You failed a concours. You did not fail at life."
          </blockquote>

          <p>
            A concours determines whether you enter a particular school at a particular time. It does not determine your intelligence, your potential, or the rest of your life.
          </p>

          <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl flex gap-3 text-sm my-6">
            <Compass className="text-orange-500 shrink-0 mt-0.5" size={18} />
            <p className="text-slate-600">
              <strong>I know this feeling because I've been there.</strong> When I didn't make it, I felt completely lost. I thought the only door had closed. But I learned that other pathways exist—and often, they lead to even better opportunities.
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-6">
            What a Concours Actually Means
          </h2>
          <p>
            Look, a concours is just a competition where they pick a few people because there are too many students and not enough desks. 
          </p>
          <p>
            Sometimes, 10,000 candidates apply for only 100 places in engineering or medical schools. The school has to reject thousands of qualified students simply because they lack space. Your performance on that particular day doesn't define you.
          </p>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-6">
            Option 1: Look for a Related Direct-Entry Program
          </h2>
          <p>
            If you wanted to study Engineering at Polytech but didn't pass, you do not have to give up on technology. You can study related direct-entry programs (programs where you don't need a concours to get in) at public or private universities:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm sm:text-base">
            <li>If you wanted <strong className="text-slate-800">Engineering</strong>, you can study <strong className="text-slate-800">Computer Science</strong>, Mathematics, Physics, or an HND in ICT.</li>
            <li>If you wanted <strong className="text-slate-800">Medicine</strong>, you can study <strong className="text-slate-800">Nursing</strong>, Medical Lab Sciences, Biochemistry, or Microbiology.</li>
            <li>If you wanted <strong className="text-slate-800">ENS (Teaching)</strong>, you can study standard Letters, History, or Science and apply for the concours again later.</li>
          </ul>

          {/* Clean Inline CTA */}
          <div className="my-8 p-6 bg-orange-50 border border-orange-200 rounded-2xl">
            <h4 className="font-bold text-slate-900 text-base">Not sure what courses you can do with your A-Levels?</h4>
            <p className="text-sm text-slate-600 mt-1">
              Enter your A-Level subjects and interests into Klarify to instantly discover Cameroonian university programs that fit your combination.
            </p>
            <button
              onClick={() => navigate("/flow")}
              className="mt-4 inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Explore Recommended Programs
              <ArrowRight size={14} />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-6">
            Option 2: Start a Related Course and Try Again
          </h2>
          <p>
            Many students register for a standard degree (like Physics or Chemistry) at a state university, attend lectures, and study to sit for the concours again next year.
          </p>
          <p>
            This keeps you in the academic loop and builds a strong foundation. However, <strong className="text-slate-950 font-extrabold">check the admission rules</strong> of the specific school first to make sure you still meet the age and registration requirements for the next attempt.
          </p>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-6">
            Option 3: Take a Gap Year, But Make It Productive
          </h2>
          <p>
            If you choose to stay home for a year and prepare, do not let the year pass you by. You should use the time to:
          </p>
          <ul className="list-decimal pl-6 space-y-2 text-slate-600 text-sm sm:text-base">
            <li><strong className="text-slate-800">Learn a practical skill:</strong> Master coding, graphic design, copywriting, tailoring, or mechanics.</li>
            <li><strong className="text-slate-800">Analyze your exam preparation:</strong> Identify exactly where you lost marks in the concours and practice past questions daily.</li>
            <li><strong className="text-slate-800">Build yourself:</strong> Read, volunteer, and learn basic communication skills.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-6">
            Don't Make Decisions While You are Devastated
          </h2>
          <p>
            Do not compare yourself to peers who passed. Give yourself a few days to process the result, talk to a teacher or orientator, and then make a plan.
          </p>
          <p>
            Remember: <strong className="text-slate-900">There is always a next path.</strong> What matters is that you keep moving forward.
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

export default ConcoursRecovery;

          {/* Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick GCE search box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h4 className="font-bold text-slate-900 text-sm mb-2">Still Need GCE Results?</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Verify your official GCE ordinary or advanced level pass marks instantly by name on our portal.
              </p>
              <Link
                to="/gce-results"
                className="block text-center py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-xs rounded-xl border border-orange-200 transition-colors"
              >
                Search GCE Results Now &rarr;
              </Link>
            </div>

            {/* SEO Tag box */}
            <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Guide Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "failing concours Cameroon",
                  "university options",
                  "ENS Bamenda",
                  "Polytech Yaounde",
                  "academic orientation",
                  "Cameroon GCE",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white border border-slate-200/80 rounded text-[10px] font-semibold text-slate-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConcoursRecovery;

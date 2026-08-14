import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Zap,
  Users,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";

const PartnersLanding = () => {
  return (
    <Layout>
      <SEOHead
        title="Partner Portal for Private Universities in Cameroon | Klarify"
        description="List your private higher education institute (IPES) on Klarify to reach thousands of GCE A-Level students matching your degree programs."
        canonicalUrl="https://www.klarifypath.com/partners"
      />

      <main className="py-8 pb-20">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden mb-16 border border-slate-800">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold mb-6">
              <Building2 size={14} />
              Private University Partner Portal
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Reach High-Intent <span className="text-orange-400">A-Level Students</span> Right When They Decide
            </h1>

            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
              Join Cameroon's top private higher institutes (IPES). Self-onboard your campus, upload your degree & HND programs, display your tuition fees, and get direct student leads on WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/partner/register"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm sm:text-base"
              >
                Register Your University Now
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/partner/register"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-4 rounded-xl border border-white/15 transition-all text-sm"
              >
                View Portal Features
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition Cards */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-eyebrow block mb-2">Why Partner With Us</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built for Cameroonian Private Institutes (IPES)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 font-bold">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Matching Placement</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                When students enter their GCE A-Level subject combinations, our AI recommender matches eligible students directly to your degree programs.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 font-bold">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Direct WhatsApp Leads</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Students can click a single button on your program cards to chat directly with your admissions office or registrar on WhatsApp.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-5 font-bold">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Complete Self-Service</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No need to wait for manual updates. Add, edit, or remove your campus programs, tuition fees, and admission deadlines anytime from your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Plan Tiers Pricing Section */}
        <section className="mb-20 bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-eyebrow block mb-2">Transparent Partner Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Simple Listing Plans
            </h2>
            <p className="text-slate-600 text-sm">
              Payments processed securely via Mobile Money (MTN MoMo & Orange Money).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Starter</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Basic Listing</h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-4">Free</div>
                <p className="text-xs text-slate-500 mb-6">Ideal for small private institutes starting out.</p>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span>List up to 3 programs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span>Basic campus profile & city location</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <span className="line-through">WhatsApp Lead Button</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/partner/register"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors text-center block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="bg-white p-7 rounded-2xl border-2 border-orange-500 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-500 block mb-1">Pro Partner</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Unlimited IPES</h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">150,000 XAF <span className="text-xs font-normal text-slate-500">/ yr</span></div>
                <p className="text-xs text-slate-500 mb-6">Full features for growing private universities.</p>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <strong className="text-slate-900">Unlimited academic programs</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span>Direct WhatsApp Admissions Lead Button</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span>Display annual tuition fees & deadlines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span>Verified Institution Badge</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/partner/register"
                className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs rounded-xl transition-colors text-center block shadow-md shadow-orange-500/20"
              >
                Register Pro Campus
              </Link>
            </div>

            {/* Featured Campus */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Featured</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Featured Campus</h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">350,000 XAF <span className="text-xs font-normal text-slate-500">/ yr</span></div>
                <p className="text-xs text-slate-500 mb-6">Maximum visibility during GCE results release.</p>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span>Everything in Pro Plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <strong className="text-slate-900">Top Priority Ranking in Recommender</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span>Featured Banner on Homepage</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/partner/register"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors text-center block"
              >
                Get Featured
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <ShieldCheck size={40} className="mx-auto text-orange-500 mb-3" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to list your programs?</h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            Setup takes less than 3 minutes. Start adding your university campus and academic courses today.
          </p>
          <Link
            to="/partner/register"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/25"
          >
            Create Partner Account
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </Layout>
  );
};

export default PartnersLanding;

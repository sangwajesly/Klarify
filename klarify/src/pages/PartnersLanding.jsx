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
import heroBg from "../assets/pexels-the-artboard-131151099-18346466.jpg";
import { trackEvent } from "../utils/analytics";

const PartnersLanding = () => {
  return (
    <Layout noPadding={true}>
      <SEOHead
        title="Partner Portal for Private Universities in Cameroon | Klarify"
        description="List your private higher education institute (IPES) on Klarify to reach thousands of GCE A-Level students matching your degree programs."
        canonicalUrl="https://www.klarifypath.com/partners"
      />

      <main>
        {/* Hero Section (campus image background) */}
        <section className="relative w-full min-h-[78vh] flex items-center justify-center overflow-hidden py-16">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroBg})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-900/80 to-slate-900/95" />
            <div className="absolute inset-0 bg-linear-to-r from-orange-900/10 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/6 text-white text-xs font-medium mb-6 backdrop-blur-sm mx-auto">
              <Building2 size={14} />
              Private University Partner Portal
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Reach High-Intent
              <span className="text-orange-400 block sm:inline">
                {" "}
                A-Level Students
              </span>
              <span className="block">Right When They Decide</span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join Cameroon's top private institutes (IPES). Self-onboard your
              campus, upload degree & HND programs, display tuition fees, and
              receive direct student leads on WhatsApp, all from your partner
              dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/partner/register?utm_source=site&utm_medium=partners_hero&utm_campaign=partner_acquisition"
                onClick={() =>
                  trackEvent("partner_cta_click", { location: "partners_hero" })
                }
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition-colors"
              >
                Register Your University Now
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/partner/login"
                className="inline-flex items-center gap-2 text-white/90 font-semibold px-5 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                Institution Login
              </Link>

              <Link
                to="/partners#features"
                onClick={() =>
                  trackEvent("partner_cta_click", {
                    location: "partners_hero_features",
                  })
                }
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-3 rounded-xl border border-white/10 text-sm"
              >
                View Portal Features
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition Cards */}
        <section className="mt-12 md:mt-16 mb-20 px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="section-eyebrow block mb-2">
              Why Partner With Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built for Cameroonian Private Institutes (IPES)
            </h2>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 font-bold">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Intelligent Student Matching
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                When students enter their GCE A-Level subject combinations, our
                matching engine highlights your eligible degree programs directly.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 font-bold">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Direct WhatsApp Leads
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Students can click a single button on your program cards to chat
                directly with your admissions office or registrar on WhatsApp.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-5 font-bold">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Complete Self-Service
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No need to wait for manual updates. Add, edit, or remove your
                campus programs, tuition fees, and admission deadlines anytime
                from your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Plan Tiers Pricing Section */}
        <section className="mb-20 bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-eyebrow block mb-2">
              Transparent Partner Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Simple Listing Plans
            </h2>
            <p className="text-slate-600 text-sm">
              Payments processed securely via Mobile Money (MTN MoMo & Orange
              Money).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Starter
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Basic Listing
                </h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-4">
                  Free
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Ideal for small private institutes starting out.
                </p>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>List up to 3 programs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
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
                <span className="text-xs font-bold uppercase tracking-wider text-orange-500 block mb-1">
                  Pro Partner
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Unlimited IPES
                </h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                  150,000 XAF{" "}
                  <span className="text-xs font-normal text-slate-500">
                    / yr
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Full features for growing private universities.
                </p>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <strong className="text-slate-900">
                      Unlimited academic programs
                    </strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>Direct WhatsApp Admissions Lead Button</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>Display annual tuition fees & deadlines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
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
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Featured
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Featured Campus
                </h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                  350,000 XAF{" "}
                  <span className="text-xs font-normal text-slate-500">
                    / yr
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Maximum visibility during GCE results release.
                </p>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>Everything in Pro Plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <strong className="text-slate-900">
                      Top Priority Ranking in Recommender
                    </strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Ready to list your programs?
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            Setup takes less than 3 minutes. Start adding your university campus
            and academic courses today.
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

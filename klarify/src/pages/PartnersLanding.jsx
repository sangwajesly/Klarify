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
import { useLanguage } from "../context/LanguageContext";

const PartnersLanding = () => {
  const { t } = useLanguage();
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
              {t("partners.hero.badge")}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              {t("partners.hero.heading1")}
              <span className="text-orange-400 block sm:inline">
                {" "}
                {t("partners.hero.heading2")}
              </span>
              <span className="block">{t("partners.hero.heading3")}</span>
            </h1>

            <p className="text-base md:text-lg text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("partners.hero.text")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/partner/register?utm_source=site&utm_medium=partners_hero&utm_campaign=partner_acquisition"
                onClick={() =>
                  trackEvent("partner_cta_click", { location: "partners_hero" })
                }
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition-colors"
              >
                {t("partners.hero.primaryCta")}
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/partner/login"
                className="inline-flex items-center gap-2 text-white/90 font-semibold px-5 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                {t("partners.hero.login")}
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
                {t("partners.hero.featuresCta")}
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition Cards */}
        <section className="mt-12 md:mt-16 mb-20 px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="section-eyebrow block mb-2">
              {t("partners.value.eyebrow")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t("partners.value.heading")}
            </h2>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 font-bold">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("partners.value.cards.0.title")}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t("partners.value.cards.0.desc")}
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 font-bold">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("partners.value.cards.1.title")}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t("partners.value.cards.1.desc")}
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-5 font-bold">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("partners.value.cards.2.title")}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t("partners.value.cards.2.desc")}
              </p>
            </div>
          </div>
        </section>

        {/* Plan Tiers Pricing Section */}
        <section className="mb-20 bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-eyebrow block mb-2">
              {t("partners.pricing.eyebrow")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              {t("partners.pricing.heading")}
            </h2>
            <p className="text-slate-600 text-sm">
              {t("partners.pricing.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t("partners.pricing.starter")}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {t("partners.pricing.basicListing")}
                </h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-4">
                  {t("partners.pricing.free")}
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  {t("partners.pricing.idealFor")}
                </p>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>{t("partners.pricing.listUpTo3")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>{t("partners.pricing.basicCampus")}</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <span className="line-through">
                      {t("partners.pricing.whatsappLead")}
                    </span>
                  </li>
                </ul>
              </div>

              <Link
                to="/partner/register"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors text-center block"
              >
                {t("partners.pricing.getStartedFree")}
              </Link>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="bg-white p-7 rounded-2xl border-2 border-orange-500 shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                {t("partners.pricing.mostPopular")}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-500 block mb-1">
                  {t("partners.pricing.proPartner")}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {t("partners.pricing.unlimited")}
                </h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                  150,000 XAF{" "}
                  <span className="text-xs font-normal text-slate-500">
                    {t("partners.pricing.annual")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  {t("partners.pricing.fullFeatures")}
                </p>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <strong className="text-slate-900">
                      {t("partners.pricing.unlimited")}
                    </strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>{t("partners.pricing.directWhatsApp")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>{t("partners.pricing.displayFees")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>{t("partners.pricing.verifiedBadge")}</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/partner/register"
                className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs rounded-xl transition-colors text-center block shadow-md shadow-orange-500/20"
              >
                {t("partners.pricing.registerProCampus")}
              </Link>
            </div>

            {/* Featured Campus */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t("partners.pricing.featured")}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {t("partners.pricing.featuredCampus")}
                </h3>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                  350,000 XAF{" "}
                  <span className="text-xs font-normal text-slate-500">
                    {t("partners.pricing.annual")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  {t("partners.pricing.maxVisibility")}
                </p>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>{t("partners.pricing.everythingInPro")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <strong className="text-slate-900">
                      {t("partners.pricing.topPriority")}
                    </strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                    <span>{t("partners.pricing.featuredBanner")}</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/partner/register"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors text-center block"
              >
                {t("partners.pricing.getFeatured")}
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Bottom Banner */}
        <section className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <ShieldCheck size={40} className="mx-auto text-orange-500 mb-3" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {t("partners.pricing.ctaHeading")}
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            {t("partners.pricing.ctaText")}
          </p>
          <Link
            to="/partner/register"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/25"
          >
            {t("partners.pricing.ctaButton")}
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </Layout>
  );
};

export default PartnersLanding;

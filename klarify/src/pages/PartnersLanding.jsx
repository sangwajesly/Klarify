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
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import heroBg from "../assets/pexels-the-artboard-131151099-18346466.jpg";
import { trackEvent } from "../utils/analytics";
import { useLanguage } from "../context/LanguageContext";

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

const PartnersLanding = () => {
  const { t } = useLanguage();
  return (
    <Layout noPadding={true}>
      <SEOHead
        title="Partner Portal for Private Universities in Cameroon | Klarify"
        description="List your private higher education institute (IPES) on Klarify to reach thousands of GCE A-Level students matching your degree programs."
        canonicalUrl="https://www.klarifypath.com/partners"
      />

      <main className="bg-white dark:bg-slate-900 selection:bg-orange-500/30">
        {/* ── Modern Hero Section ── */}
        <section className="relative pt-8 pb-20 md:pt-12 md:pb-32 overflow-hidden border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
              
              {/* Hero Content */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-2xl"
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-widest mb-8">
                  <Building2 size={14} className="text-orange-500" />
                  {t("partners.hero.badge")}
                </motion.div>
                
                <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                  {t("partners.hero.heading1")}{" "}
                  <span className="text-orange-500">{t("partners.hero.heading2")}</span>
                  <span className="block mt-2 text-4xl text-slate-500 dark:text-slate-400">{t("partners.hero.heading3")}</span>
                </motion.h1>
                
                <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
                  {t("partners.hero.text")}
                </motion.p>
                
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    to="/partner/register?utm_source=site&utm_medium=partners_hero&utm_campaign=partner_acquisition"
                    onClick={() => trackEvent("partner_cta_click", { location: "partners_hero" })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {t("partners.hero.primaryCta")}
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/partner/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:text-white font-bold px-6 py-4 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 transition-colors"
                  >
                    {t("partners.hero.login")}
                  </Link>
                </motion.div>
              </motion.div>

              {/* Hero Image / Composition */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="absolute inset-0 translate-x-8 translate-y-8 bg-orange-50 rounded-[3rem]" />
                
                <img 
                  src={heroBg} 
                  alt="Modern University Campus" 
                  className="relative z-10 w-full h-[650px] object-cover rounded-[3rem] shadow-2xl shadow-slate-900/10 grayscale-[15%]"
                />
                
                <div className="absolute top-12 -left-12 z-20 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 dark:border-slate-800 max-w-[280px]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white">
                      <Users size={20} />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">2.5k+</div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Monthly Leads</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Value Proposition (Bento Grid) ── */}
        <section id="features" className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                {t("partners.value.eyebrow")}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("partners.value.heading")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-700 hover:border-orange-500/30 transition-colors group">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white mb-6 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t("partners.value.cards.0.title")}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("partners.value.cards.0.desc")}
                </p>
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 dark:bg-slate-900/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm border border-white/10">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{t("partners.value.cards.1.title")}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {t("partners.value.cards.1.desc")}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 border border-slate-200 dark:border-slate-700 hover:border-orange-500/30 transition-colors group">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white mb-6 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                  <Users size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t("partners.value.cards.2.title")}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("partners.value.cards.2.desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Section ── */}
        <section className="py-24 px-6 md:px-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 block">
                {t("partners.pricing.eyebrow")}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                {t("partners.pricing.heading")}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {t("partners.pricing.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
              
              {/* Free Tier */}
              <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-[90%]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">
                    {t("partners.pricing.starter")}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {t("partners.pricing.basicListing")}
                  </h3>
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                    {t("partners.pricing.free")}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                    {t("partners.pricing.idealFor")}
                  </p>

                  <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 mb-10 font-medium">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-slate-300 shrink-0" />
                      <span>{t("partners.pricing.listUpTo3")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-slate-300 shrink-0" />
                      <span>{t("partners.pricing.basicCampus")}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-400">
                      <span className="line-through">{t("partners.pricing.whatsappLead")}</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/partner/register"
                  className="w-full py-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm rounded-full transition-colors text-center block"
                >
                  {t("partners.pricing.getStartedFree")}
                </Link>
              </div>

              {/* Pro Tier (Popular) */}
              <div className="bg-slate-900 text-white p-10 md:py-14 rounded-[2.5rem] relative flex flex-col justify-between shadow-2xl shadow-slate-900/20 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold uppercase px-6 py-2 rounded-full tracking-widest shadow-lg">
                  {t("partners.pricing.mostPopular")}
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block mb-2">
                    {t("partners.pricing.proPartner")}
                  </span>
                  <h3 className="text-2xl font-bold mb-2">
                    {t("partners.pricing.unlimited")}
                  </h3>
                  <div className="text-5xl font-extrabold mb-2 tracking-tight">
                    150k <span className="text-xl font-medium text-slate-400">XAF</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-slate-800">
                    {t("partners.pricing.fullFeatures")} <br/>({t("partners.pricing.annual")})
                  </p>

                  <ul className="space-y-4 text-sm text-slate-200 mb-10 font-medium">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                      <strong className="text-white">{t("partners.pricing.unlimited")}</strong>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                      <span>{t("partners.pricing.directWhatsApp")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                      <span>{t("partners.pricing.displayFees")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                      <span>{t("partners.pricing.verifiedBadge")}</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/partner/register"
                  className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-full transition-colors text-center block shadow-lg shadow-orange-500/20"
                >
                  {t("partners.pricing.registerProCampus")}
                </Link>
              </div>

              {/* Featured Campus */}
              <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-[90%]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">
                    {t("partners.pricing.featured")}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {t("partners.pricing.featuredCampus")}
                  </h3>
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                    350k <span className="text-xl font-medium text-slate-500 dark:text-slate-400">XAF</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                    {t("partners.pricing.maxVisibility")} <br/>({t("partners.pricing.annual")})
                  </p>

                  <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 mb-10 font-medium">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-slate-400 shrink-0" />
                      <span>{t("partners.pricing.everythingInPro")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-slate-900 dark:text-white shrink-0" />
                      <strong className="text-slate-900 dark:text-white">{t("partners.pricing.topPriority")}</strong>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-slate-900 dark:text-white shrink-0" />
                      <span>{t("partners.pricing.featuredBanner")}</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/partner/register"
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-full transition-colors text-center block"
                >
                  {t("partners.pricing.getFeatured")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-32 px-6 md:px-12 bg-orange-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <ShieldCheck size={56} className="mx-auto text-white mb-8 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              {t("partners.pricing.ctaHeading")}
            </h2>
            <p className="text-orange-50 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("partners.pricing.ctaText")}
            </p>
            <Link
              to="/partner/register"
              className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20"
            >
              {t("partners.pricing.ctaButton")}
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default PartnersLanding;

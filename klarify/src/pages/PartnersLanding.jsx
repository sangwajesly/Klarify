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
  Sparkles,
  Play
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

      <main className="bg-white dark:bg-slate-900 selection:bg-secondary-500/30">
        {/* ── ALX-Modeled Partner Hero Section ── */}
        <section className="relative bg-[#0B132B] pt-12 pb-20 md:pt-16 md:pb-28 px-6 md:px-12 overflow-hidden border-b border-white/10">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(31,59,143,0.4),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(198,212,51,0.09),transparent_60%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              
              {/* Left Column: Bold Editorial Typography */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="lg:col-span-7 max-w-2xl"
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold mb-6 border border-white/15 backdrop-blur-md shadow-xs">
                  <Building2 size={14} className="text-secondary-400" />
                  <span>{t("partners.hero.badge")}</span>
                </motion.div>
                
                <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.12] mb-6 tracking-tight">
                  {t("partners.hero.heading1")}{" "}
                  <span className="text-secondary-400">{t("partners.hero.heading2")}</span>
                  <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl text-slate-300 font-semibold">{t("partners.hero.heading3")}</span>
                </motion.h1>
                
                <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl font-normal">
                  {t("partners.hero.text")}
                </motion.p>
                
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    to="/partner/register?utm_source=site&utm_medium=partners_hero&utm_campaign=partner_acquisition"
                    onClick={() => trackEvent("partner_cta_click", { location: "partners_hero" })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-black py-3 sm:py-4 px-6 sm:px-8 rounded-full text-xs sm:text-sm md:text-base transition-all duration-300 shadow-lg shadow-secondary-500/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span>{t("partners.hero.primaryCta")}</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/partner/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white hover:text-white font-bold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-colors cursor-pointer"
                  >
                    <span>{t("partners.hero.login")}</span>
                  </Link>
                </motion.div>

                {/* Trust & Proof Highlights Bar */}
                <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 pt-8 mt-10 border-t border-white/10">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white">2.5k+</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">Monthly GCE Leads</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">Verified Campuses</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white">Direct</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">WhatsApp Inquiry</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column: ALX-Style Signature Showcase Video Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="lg:col-span-5 relative"
              >
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary-500/30 to-secondary-500/20 rounded-[2.8rem] blur-xl opacity-75" />

                {/* Main Card */}
                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/15 bg-slate-900 shadow-2xl group">
                  {/* Floating live indicator pill */}
                  <div className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Campus Discovery</span>
                  </div>

                  {/* Campus / Student Showcase Image */}
                  <div className="aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-slate-800">
                    <img 
                      src={heroBg} 
                      alt="Modern University Campus & Students" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.92]"
                    />
                  </div>

                  {/* ALX-Style Bottom Media Bar */}
                  <div className="p-5 sm:p-6 bg-slate-950/85 backdrop-blur-md border-t border-white/10 flex items-center gap-4">
                    {/* Coral Red Round Play Button */}
                    <div className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/30 transition-transform group-hover:scale-110 cursor-pointer">
                      <Play size={18} className="fill-current ml-0.5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs sm:text-sm font-semibold leading-snug line-clamp-2">
                        Watch how top Cameroon universities scale verified student enrollments on Klarify.
                      </p>
                      <span className="text-[11px] font-bold text-secondary-400 uppercase tracking-wider mt-1 block">
                        2-Minute Admissions Showcase
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Value Proposition (Bento Grid) ── */}
        <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-primary-500 dark:text-secondary-400 uppercase tracking-wider block mb-2">
                {t("partners.value.eyebrow")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("partners.value.heading")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#0F1626] rounded-[2.5rem] p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                <div className="w-14 h-14 bg-secondary-100/70 dark:bg-secondary-950/40 text-secondary-900 dark:text-secondary-300 rounded-2xl flex items-center justify-center mb-6 shadow-xs">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">{t("partners.value.cards.0.title")}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  {t("partners.value.cards.0.desc")}
                </p>
              </div>

              <div className="bg-primary-500 rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-lg group">
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm border border-white/20 shadow-xs">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{t("partners.value.cards.1.title")}</h3>
                  <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
                    {t("partners.value.cards.1.desc")}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0F1626] rounded-[2.5rem] p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-300 rounded-2xl flex items-center justify-center mb-6 shadow-xs">
                  <Users size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">{t("partners.value.cards.2.title")}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  {t("partners.value.cards.2.desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Section ── */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-xs font-bold text-primary-500 dark:text-secondary-400 uppercase tracking-wider block mb-2">
                {t("partners.pricing.eyebrow")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                {t("partners.pricing.heading")}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {t("partners.pricing.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-7xl mx-auto">
              
              {/* Free Tier */}
              <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-[90%]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">
                    {t("partners.pricing.starter")}
                  </span>
                  <h3 className="text-lg sm:text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
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

              {/* Pro Tier (Flexible Cohort Pass) */}
              <div className="bg-slate-900 text-white p-10 md:py-14 rounded-[2.5rem] relative flex flex-col justify-between shadow-2xl shadow-slate-900/20 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary-500 text-slate-950 font-bold text-xs font-bold uppercase px-6 py-2 rounded-full tracking-widest shadow-lg">
                  {t("partners.pricing.mostPopular")}
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary-400 block mb-2">
                    {t("partners.pricing.proPartner")}
                  </span>
                  <h3 className="text-2xl font-bold mb-2">
                    {t("partners.pricing.unlimited")}
                  </h3>
                  <div className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tight">
                    From 25k <span className="text-xl font-medium text-slate-400">XAF</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-slate-800">
                    {t("partners.pricing.fullFeatures")} <br/>(1, 3, or 6-Month Pass)
                  </p>

                  <ul className="space-y-4 text-sm text-slate-200 mb-10 font-medium">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-secondary-400 shrink-0" />
                      <strong className="text-white">Unlimited Course & Cohort Listings</strong>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-secondary-400 shrink-0" />
                      <span>{t("partners.pricing.directWhatsApp")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-secondary-400 shrink-0" />
                      <span>{t("partners.pricing.displayFees")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-secondary-400 shrink-0" />
                      <span>{t("partners.pricing.verifiedBadge")}</span>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/partner/register"
                  className="w-full py-4 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-bold text-sm rounded-full transition-colors text-center block shadow-lg shadow-secondary-500/20"
                >
                  {t("partners.pricing.registerProCampus")}
                </Link>
              </div>

              {/* Annual Institutional Pass */}
              <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-[90%]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">
                    {t("partners.pricing.featured")}
                  </span>
                  <h3 className="text-lg sm:text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {t("partners.pricing.featuredCampus")}
                  </h3>
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                    150k <span className="text-xl font-medium text-slate-500 dark:text-slate-400">XAF</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                    {t("partners.pricing.maxVisibility")} <br/>(Full 12-Month Year)
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
        <section className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 bg-secondary-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <ShieldCheck size={56} className="mx-auto text-white mb-8 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              {t("partners.pricing.ctaHeading")}
            </h2>
            <p className="text-primary-50 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("partners.pricing.ctaText")}
            </p>
            <Link
              to="/partner/register"
              className="inline-flex items-center gap-2.5 sm:gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm md:text-base transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20"
            >
              {t("partners.pricing.ctaButton")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default PartnersLanding;

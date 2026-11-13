import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useLanguage } from "../context/LanguageContext";

const Privacy = () => {
  const { t } = useLanguage();

  const navItems = [
    { id: "who-we-are", label: "01. Who We Are" },
    { id: "collect", label: "02. Information We Collect" },
    { id: "use", label: "03. How We Use Information" },
    { id: "sharing", label: "04. Third-Party Sharing" },
    { id: "gce-data", label: "05. GCE Results Data" },
    { id: "cookies", label: "06. Cookies & Sessions" },
    { id: "rights", label: "07. Your Privacy Rights" },
    { id: "security", label: "08. Data Security" },
    { id: "changes", label: "09. Policy Updates" },
    { id: "contact", label: "10. Contact Us" },
  ];

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="Privacy Policy | Klarify"
        description="Learn how Klarify protects, collects, and manages your personal information when using our academic orientation services."
        canonicalUrl="https://www.klarifypath.com/privacy"
      />

      <main className="bg-white dark:bg-[#080C14] text-slate-800 dark:text-slate-200 selection:bg-secondary-500/30">
        {/* ── Soft Hero Header (ALX-Style Open Editorial) ── */}
        <section className="bg-slate-50/70 dark:bg-[#0A1020] border-b border-slate-100 dark:border-slate-800/80 pt-16 pb-14 md:pt-20 md:pb-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200/50 dark:border-primary-800/50 text-primary-700 dark:text-secondary-400 text-xs font-bold tracking-wide uppercase mb-4">
              <ShieldCheck size={14} className="text-primary-500 dark:text-secondary-400" />
              <span>Legal Transparency</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {t("legal.privacy.title")}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-4 font-medium">
              <span>{t("legal.privacy.lastUpdated")}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>6 min read</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>Applicable to all Klarify users</span>
            </div>
          </div>
        </section>

        {/* ── Main Open Reading Canvas (No Boxed Rectangles) ── */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Sticky Table of Contents (Desktop) */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-28 self-start space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-3">
                  On this page
                </span>
                <nav className="space-y-1 text-sm">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block py-1.5 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-secondary-400 font-medium transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 leading-relaxed">
                  Questions about how we handle your data? Email our privacy desk at{" "}
                  <a
                    href="mailto:adminklarify@gmail.com"
                    className="text-primary-600 dark:text-secondary-400 font-semibold hover:underline"
                  >
                    adminklarify@gmail.com
                  </a>
                </div>
              </div>
            </aside>

            {/* Right Main Editorial Column */}
            <article className="lg:col-span-8 space-y-12">
              
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {t("legal.privacy.intro", { domain: "klarifypath.com" })}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  We believe transparency is the foundation of trustworthy educational guidance. This policy outlines what data we process, why we need it, and how your privacy remains protected under Cameroon regulations and international standards.
                </p>
              </div>

              {/* 01. Who We Are */}
              <section id="who-we-are" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">01.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Who We Are
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>
                    Klarify is an independent academic and career guidance platform built for Cameroon. We help secondary school graduates, university students, and career builders identify optimal university programs, technical certifications, and verified partner institutions.
                  </p>
                  <p>
                    For the purposes of applicable data protection principles, Klarify operates as the data controller for information gathered through our recommendation engine and partner portal.
                  </p>
                </div>
              </section>

              {/* 02. Information We Collect */}
              <section id="collect" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">02.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.privacy.collectTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{t("legal.privacy.collectIntro")}</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.collect1")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.collect2")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.collect3")}</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 03. How We Use Information */}
              <section id="use" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">03.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.privacy.useTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{t("legal.privacy.useIntro")}</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.use1")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.use2")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.use3")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.use4")}</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 04. Third-Party Sharing */}
              <section id="sharing" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">04.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.privacy.sharingTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{t("legal.privacy.sharingIntro")}</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.sharing1")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.sharing2")}</span>
                    </li>
                  </ul>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm pt-2">
                    {t("legal.privacy.sharing3")}
                  </p>
                </div>
              </section>

              {/* 05. GCE Results Data */}
              <section id="gce-data" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">05.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.privacy.gceTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.privacy.gceText")}</p>
                </div>
              </section>

              {/* 06. Cookies & Sessions */}
              <section id="cookies" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">06.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.privacy.cookiesTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.privacy.cookiesText")}</p>
                </div>
              </section>

              {/* 07. Your Privacy Rights */}
              <section id="rights" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">07.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.privacy.rightsTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{t("legal.privacy.rightsIntro")}</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.rights1")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.rights2")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.privacy.rights3")}</span>
                    </li>
                  </ul>
                  <p className="pt-2 text-sm text-slate-500 dark:text-slate-400">
                    {t("legal.privacy.rights4", { email: "adminklarify@gmail.com" })}
                  </p>
                </div>
              </section>

              {/* 08. Data Security */}
              <section id="security" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">08.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.privacy.securityTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.privacy.securityText")}</p>
                </div>
              </section>

              {/* 09. Changes to this Policy */}
              <section id="changes" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">09.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.privacy.changesTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.privacy.changesText")}</p>
                </div>
              </section>

              {/* 10. Contact Us */}
              <section id="contact" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">10.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Contact & Privacy Inquiries
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    If you have questions, feedback, or data requests regarding this Privacy Policy or Klarify services, our team is accessible directly:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <a
                      href="mailto:adminklarify@gmail.com"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm"
                    >
                      <Mail size={16} />
                      <span>Email Privacy Desk</span>
                    </a>
                    <Link
                      to="/terms"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-600 dark:text-secondary-400 hover:underline"
                    >
                      <span>Read Terms of Service</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </section>

            </article>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Privacy;

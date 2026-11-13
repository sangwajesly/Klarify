import React from "react";
import { Link } from "react-router-dom";
import { FileText, Mail, ArrowUpRight } from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useLanguage } from "../context/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();

  const navItems = [
    { id: "about", label: "01. About the Service" },
    { id: "eligibility", label: "02. Eligibility" },
    { id: "accounts", label: "03. User Accounts" },
    { id: "gce-disclaimer", label: "04. GCE Results Disclaimer" },
    { id: "recommendations", label: "05. Academic Recommendations" },
    { id: "conduct", label: "06. Prohibited Conduct" },
    { id: "ip", label: "07. Intellectual Property" },
    { id: "liability", label: "08. Limitation of Liability" },
    { id: "changes", label: "09. Changes to Terms" },
    { id: "contact", label: "10. Contact Us" },
  ];

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="Terms of Service | Klarify"
        description="Read the terms of service that govern your use of the Klarify academic recommendation engine and results search platform."
        canonicalUrl="https://www.klarifypath.com/terms"
      />

      <main className="bg-white dark:bg-[#080C14] text-slate-800 dark:text-slate-200 selection:bg-secondary-500/30">
        {/* ── Soft Hero Header (ALX-Style Open Editorial) ── */}
        <section className="bg-slate-50/70 dark:bg-[#0A1020] border-b border-slate-100 dark:border-slate-800/80 pt-16 pb-14 md:pt-20 md:pb-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200/50 dark:border-primary-800/50 text-primary-700 dark:text-secondary-400 text-xs font-bold tracking-wide uppercase mb-4">
              <FileText size={14} className="text-primary-500 dark:text-secondary-400" />
              <span>Platform Agreement</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {t("legal.terms.title")}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-4 font-medium">
              <span>{t("legal.terms.lastUpdated")}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>7 min read</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>Terms of Service</span>
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
                  Questions about our terms? Contact our advisory team at{" "}
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
                  {t("legal.terms.intro", { domain: "klarifypath.com" })}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  These terms govern your access to and use of Klarify website, services, recommendation algorithms, and partner tools. By using our platform, you accept these terms in full.
                </p>
              </div>

              {/* 01. About the Service */}
              <section id="about" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">01.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.aboutTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.terms.aboutText")}</p>
                </div>
              </section>

              {/* 02. Eligibility */}
              <section id="eligibility" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">02.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.eligibilityTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.terms.eligibilityText")}</p>
                </div>
              </section>

              {/* 03. User Accounts */}
              <section id="accounts" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">03.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.accountsTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{t("legal.terms.accountsIntro")}</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.terms.accounts1")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.terms.accounts2")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.terms.accounts3")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.terms.accounts4")}</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 04. GCE Results Disclaimer */}
              <section id="gce-disclaimer" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">04.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.gceTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.terms.gceText")}</p>
                </div>
              </section>

              {/* 05. Academic Recommendations */}
              <section id="recommendations" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">05.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.recommendationsTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.terms.recommendationsText")}</p>
                </div>
              </section>

              {/* 06. Prohibited Conduct */}
              <section id="conduct" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">06.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.conductTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{t("legal.terms.conductIntro")}</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.terms.conduct1")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.terms.conduct2")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.terms.conduct3")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-secondary-400 mt-2 shrink-0" />
                      <span>{t("legal.terms.conduct4")}</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 07. Intellectual Property */}
              <section id="ip" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">07.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.ipTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.terms.ipText")}</p>
                </div>
              </section>

              {/* 08. Limitation of Liability */}
              <section id="liability" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">08.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.liabilityTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.terms.liabilityText")}</p>
                </div>
              </section>

              {/* 09. Changes to Terms */}
              <section id="changes" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">09.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.changesTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>{t("legal.terms.changesText")}</p>
                </div>
              </section>

              {/* 10. Contact Us */}
              <section id="contact" className="pt-8 border-t border-slate-100 dark:border-slate-800/80 scroll-mt-28">
                <div className="flex items-baseline gap-2.5 mb-4">
                  <span className="text-xs font-mono font-bold text-primary-500 dark:text-secondary-400">10.</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {t("legal.terms.contactTitle")}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{t("legal.terms.contactText")}</p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <a
                      href="mailto:adminklarify@gmail.com"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm"
                    >
                      <Mail size={16} />
                      <span>Email Legal Team</span>
                    </a>
                    <Link
                      to="/privacy"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-600 dark:text-secondary-400 hover:underline"
                    >
                      <span>Read Privacy Policy</span>
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

export default Terms;

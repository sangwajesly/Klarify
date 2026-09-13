import React from "react";
import Layout from "../components/Layout";
import { FileText } from "lucide-react";
import SEOHead from "../components/SEOHead";
import { useLanguage } from "../context/LanguageContext";

const Section = ({ title, children }) => (
  <section className="mb-14">
    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
      {title}
    </h2>
    <div className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed space-y-4">
      {children}
    </div>
  </section>
);

const Terms = () => {
  const { t } = useLanguage();

  return (
    <Layout noPadding={false}>
      <SEOHead
        title="Terms of Service | Klarify"
        description="Read the terms of service that govern your use of the Klarify academic recommendation engine and results search platform."
      />

      <main className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-8 pb-16 md:pt-12 md:pb-24 px-6 selection:bg-orange-500/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-16 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-12 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <FileText size={32} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {t("legal.terms.title")}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">
                  {t("legal.terms.lastUpdated")}
                </p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-12">
              {t("legal.terms.intro", { domain: "klarifypath.com" })}
            </p>

          <Section title={t("legal.terms.aboutTitle")}>
            <p>{t("legal.terms.aboutText")}</p>
          </Section>

          <Section title={t("legal.terms.eligibilityTitle")}>
            <p>{t("legal.terms.eligibilityText")}</p>
          </Section>

          <Section title={t("legal.terms.accountsTitle")}>
            <p>{t("legal.terms.accountsIntro")}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <li>{t("legal.terms.accounts1")}</li>
              <li>{t("legal.terms.accounts2")}</li>
              <li>{t("legal.terms.accounts3")}</li>
              <li>{t("legal.terms.accounts4")}</li>
            </ul>
          </Section>

          <Section title={t("legal.terms.gceTitle")}>
            <p>{t("legal.terms.gceText")}</p>
          </Section>

          <Section title={t("legal.terms.recommendationsTitle")}>
            <p>{t("legal.terms.recommendationsText")}</p>
          </Section>

          <Section title={t("legal.terms.conductTitle")}>
            <p>{t("legal.terms.conductIntro")}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <li>{t("legal.terms.conduct1")}</li>
              <li>{t("legal.terms.conduct2")}</li>
              <li>{t("legal.terms.conduct3")}</li>
              <li>{t("legal.terms.conduct4")}</li>
            </ul>
          </Section>

          <Section title={t("legal.terms.ipTitle")}>
            <p>{t("legal.terms.ipText")}</p>
          </Section>

          <Section title={t("legal.terms.liabilityTitle")}>
            <p>{t("legal.terms.liabilityText")}</p>
          </Section>

          <Section title={t("legal.terms.changesTitle")}>
            <p>{t("legal.terms.changesText")}</p>
          </Section>

          <Section title={t("legal.terms.contactTitle")}>
            <p>{t("legal.terms.contactText")}</p>
            <p className="mt-2">
              <a
                href="mailto:adminklarify@gmail.com"
                className="text-orange-500 hover:text-orange-400 transition-colors font-bold"
              >
                adminklarify@gmail.com
              </a>
            </p>
          </Section>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t("legal.terms.footerText")}
            </p>
          </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Terms;

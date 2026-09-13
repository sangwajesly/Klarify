import React from "react";
import Layout from "../components/Layout";
import { ShieldCheck } from "lucide-react";
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

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <Layout noPadding={false}>
      <SEOHead
        title="Privacy Policy | Klarify"
        description="Learn how Klarify protects, collects, and manages your personal information when using our academic orientation services."
      />

      <main className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-8 pb-16 md:pt-12 md:pb-24 px-6 selection:bg-orange-500/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-16 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-12 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {t("legal.privacy.title")}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">
                  {t("legal.privacy.lastUpdated")}
                </p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-12">
              {t("legal.privacy.intro", { domain: "klarifypath.com" })}
            </p>

          <Section title={t("legal.privacy.collectTitle")}>
            <p>{t("legal.privacy.collectIntro")}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <li>{t("legal.privacy.collect1")}</li>
              <li>{t("legal.privacy.collect2")}</li>
              <li>{t("legal.privacy.collect3")}</li>
            </ul>
          </Section>

          <Section title={t("legal.privacy.useTitle")}>
            <p>{t("legal.privacy.useIntro")}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <li>{t("legal.privacy.use1")}</li>
              <li>{t("legal.privacy.use2")}</li>
              <li>{t("legal.privacy.use3")}</li>
              <li>{t("legal.privacy.use4")}</li>
            </ul>
          </Section>

          <Section title={t("legal.privacy.sharingTitle")}>
            <p>{t("legal.privacy.sharingIntro")}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <li>{t("legal.privacy.sharing1")}</li>
              <li>{t("legal.privacy.sharing2")}</li>
            </ul>
            <p className="mt-3">{t("legal.privacy.sharing3")}</p>
          </Section>

          <Section title={t("legal.privacy.gceTitle")}>
            <p>{t("legal.privacy.gceText")}</p>
          </Section>

          <Section title={t("legal.privacy.cookiesTitle")}>
            <p>{t("legal.privacy.cookiesText")}</p>
          </Section>

          <Section title={t("legal.privacy.rightsTitle")}>
            <p>{t("legal.privacy.rightsIntro")}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base">
              <li>{t("legal.privacy.rights1")}</li>
              <li>{t("legal.privacy.rights2")}</li>
              <li>{t("legal.privacy.rights3")}</li>
            </ul>
            <p className="mt-3">
              {t("legal.privacy.rights4", { email: "adminklarify@gmail.com" })}
            </p>
          </Section>

          <Section title={t("legal.privacy.securityTitle")}>
            <p>{t("legal.privacy.securityText")}</p>
          </Section>

          <Section title={t("legal.privacy.changesTitle")}>
            <p>{t("legal.privacy.changesText")}</p>
          </Section>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t("legal.privacy.questionsText")}
            </p>
            <a
              href="mailto:adminklarify@gmail.com"
              className="text-orange-500 font-bold hover:text-orange-400 transition-colors"
            >
              {t("legal.privacy.footerEmail")}
            </a>
          </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Privacy;

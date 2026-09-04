import React from "react";
import Layout from "../components/Layout";
import { FileText } from "lucide-react";
import SEOHead from "../components/SEOHead";
import { useLanguage } from "../context/LanguageContext";

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3 border-l-2 border-orange-500 pl-4">
      {title}
    </h2>
    <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3 pl-4">
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

      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t("legal.terms.title")}
              </h1>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                {t("legal.terms.lastUpdated")}
              </p>
            </div>
          </div>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-10 pb-6 border-b border-slate-100">
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
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
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
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
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

          <div className="mt-12 p-6 bg-slate-50 border border-slate-200/60 rounded-2xl text-center">
            <p className="text-slate-500 text-sm">
              {t("legal.terms.footerText")}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;

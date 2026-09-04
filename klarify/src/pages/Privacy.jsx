import React from "react";
import Layout from "../components/Layout";
import { ShieldCheck } from "lucide-react";
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

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <Layout noPadding={false}>
      <SEOHead
        title="Privacy Policy | Klarify"
        description="Learn how Klarify protects, collects, and manages your personal information when using our academic orientation services."
      />

      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t("legal.privacy.title")}
              </h1>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                {t("legal.privacy.lastUpdated")}
              </p>
            </div>
          </div>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-10 pb-6 border-b border-slate-100">
            {t("legal.privacy.intro", { domain: "klarifypath.com" })}
          </p>

          <Section title={t("legal.privacy.collectTitle")}>
            <p>{t("legal.privacy.collectIntro")}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
              <li>{t("legal.privacy.collect1")}</li>
              <li>{t("legal.privacy.collect2")}</li>
              <li>{t("legal.privacy.collect3")}</li>
            </ul>
          </Section>

          <Section title={t("legal.privacy.useTitle")}>
            <p>{t("legal.privacy.useIntro")}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
              <li>{t("legal.privacy.use1")}</li>
              <li>{t("legal.privacy.use2")}</li>
              <li>{t("legal.privacy.use3")}</li>
              <li>{t("legal.privacy.use4")}</li>
            </ul>
          </Section>

          <Section title={t("legal.privacy.sharingTitle")}>
            <p>{t("legal.privacy.sharingIntro")}</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
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
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-600 text-sm md:text-base">
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

          <div className="mt-12 p-6 bg-slate-50 border border-slate-200/60 rounded-2xl text-center">
            <p className="text-slate-500 text-sm">
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
    </Layout>
  );
};

export default Privacy;

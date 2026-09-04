import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  User,
} from "lucide-react";
import Layout from "../components/Layout";
import ProgressBar from "../components/ProgressBar";
import SubjectSelector from "../components/SubjectSelector";
import InterestSelector from "../components/InterestSelector";
import LoadingScreen from "../components/LoadingScreen";
import SEOHead from "../components/SEOHead";
import FAQBlock from "../components/FAQBlock";
import { getRecommendations } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const PersonaButton = ({ icon: Icon, title, subtitle, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
      selected
        ? "border-orange-500 bg-orange-50/40 shadow-sm"
        : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/10"
    }`}
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        selected
          ? "bg-orange-500 text-white"
          : "bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-500"
      }`}
    >
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <h3
        className={`font-bold text-sm transition-colors ${selected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}
      >
        {title}
      </h3>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
        {subtitle}
      </p>
    </div>
    <div
      className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
        selected
          ? "bg-orange-500 ring-2 ring-orange-500 ring-offset-2"
          : "border-2 border-slate-300 group-hover:border-orange-300"
      }`}
    >
      {selected && (
        <svg className="w-3 h-3 text-white" viewBox="0 0 10 10" fill="none">
          <path
            d="M1.5 5L4 7.5L8.5 2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  </button>
);

const InputFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [persona, setPersona] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [interest, setInterest] = useState([]);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/flow" } });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (location.state?.returnToSubjects) {
      setPersona(location.state.persona || "alevel");
      setSelectedSubjects(location.state.selectedSubjects || []);
      setInterest(location.state.interest || []);
      setStep(2);
    }
  }, [location.state]);

  const handleNext = () => {
    if (step === 1 && persona) {
      setStep(2);
    } else if (
      step === 2 &&
      persona === "alevel" &&
      selectedSubjects.length >= 2
    ) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async () => {
    if (interest.length === 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      const data = await getRecommendations({
        subjects: selectedSubjects,
        interest: interest,
      });
      navigate("/results", {
        state: { results: data, subjects: selectedSubjects, interest },
      });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: "/flow" } });
      } else {
        setSubmitError("Failed to get recommendations. Please try again.");
      }
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Klarify Academic Recommender",
    url: "https://www.klarifypath.com/flow",
    description:
      "Intelligent tool that recommends university programs and career paths in Cameroon based on GCE A-Level subjects.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
  };

  const recommenderFaqs = [
    {
      question: t("flow.faq.q1"),
      answer: t("flow.faq.a1"),
    },
    {
      question: t("flow.faq.q2"),
      answer: t("flow.faq.a2"),
    },
    {
      question: t("flow.faq.q3"),
      answer: t("flow.faq.a3"),
    },
    {
      question: t("flow.faq.q4"),
      answer: t("flow.faq.a4"),
    },
  ];

  if (authLoading || !user) {
    return null;
  }

  return (
    <Layout>
      <SEOHead
        title="Academic & Career Recommender | Klarify"
        description="Get personalized university program and career recommendations in Cameroon based on your GCE A-Level subjects using our advanced matching engine."
        canonicalUrl="https://www.klarifypath.com/flow"
        structuredData={schemaData}
      />

      <AnimatePresence>
        {loading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <main className="pt-4 pb-16">
        {/* Intro */}
        <section className="max-w-2xl mx-auto px-4 mb-10">
          <span className="section-eyebrow block mb-3">
            {t("flow.intro.eyebrow")}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {t("flow.intro.heading")}
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            {t("flow.intro.text")}
          </p>
        </section>

        {/* Recommender card */}
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 focus:outline-none"
            aria-label={t("flow.backAria")}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {step === 1 ? t("flow.backHome") : t("flow.previousStep")}
          </button>

          <div className="bg-white rounded-2xl p-7 md:p-9 shadow-sm border border-slate-100 min-h-95 flex flex-col">
            {persona === "alevel" && (
              <ProgressBar currentStep={step} totalSteps={3} />
            )}
            {(!persona || persona !== "alevel") && (
              <ProgressBar currentStep={step} totalSteps={2} />
            )}

            <div className="flex-1 relative mt-2">
              <AnimatePresence mode="wait" custom={step}>
                {/* STEP 1: Persona */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={1}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                      {t("flow.step1.title")}
                    </h2>
                    <p className="text-slate-500 text-sm mb-7">
                      {t("flow.step1.subtitle")}
                    </p>

                    <div className="space-y-3">
                      <PersonaButton
                        icon={GraduationCap}
                        title={t("flow.persona.alevel.title")}
                        subtitle={t("flow.persona.alevel.subtitle")}
                        selected={persona === "alevel"}
                        onClick={() => setPersona("alevel")}
                      />
                      <PersonaButton
                        icon={BookOpen}
                        title={t("flow.persona.graduate.title")}
                        subtitle={t("flow.persona.graduate.subtitle")}
                        selected={persona === "graduate"}
                        onClick={() => setPersona("graduate")}
                      />
                      <PersonaButton
                        icon={User}
                        title={t("flow.persona.professional.title")}
                        subtitle={t("flow.persona.professional.subtitle")}
                        selected={persona === "professional"}
                        onClick={() => setPersona("professional")}
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Subjects or Coming Soon */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={1}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {persona === "alevel" ? (
                      <>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                          {t("flow.step2.alevel.title")}
                        </h2>
                        <p className="text-slate-500 text-sm mb-7">
                          {t("flow.step2.alevel.subtitle")}
                        </p>

                        <SubjectSelector
                          selected={selectedSubjects}
                          onChange={setSelectedSubjects}
                        />

                        {selectedSubjects.length > 0 &&
                          selectedSubjects.length < 2 && (
                            <p
                              className="text-xs text-orange-500 mt-4"
                              role="alert"
                            >
                              {t("flow.step2.alevel.minSubjects")}
                            </p>
                          )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center h-full">
                        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-5">
                          {persona === "graduate" ? (
                            <BookOpen size={28} />
                          ) : (
                            <User size={28} />
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">
                          {t("flow.step2.comingSoon.title")}
                        </h2>
                        <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                          {t("flow.step2.comingSoon.text", {
                            audience:
                              persona === "graduate"
                                ? t("flow.step2.comingSoon.gradAudience")
                                : t("flow.step2.comingSoon.profAudience"),
                          })}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: Interests */}
                {step === 3 && persona === "alevel" && (
                  <motion.div
                    key="step3"
                    custom={1}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                      {t("flow.step3.title")}
                    </h2>
                    <p className="text-slate-500 text-sm mb-7">
                      {t("flow.step3.subtitle")}
                    </p>

                    <InterestSelector
                      selected={interest}
                      onChange={setInterest}
                    />

                    {interest.length === 0 && (
                      <p className="text-xs text-orange-500 mt-4" role="alert">
                        {t("flow.step3.minInterest")}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {submitError && (
              <p className="text-xs text-red-500 mt-3" role="alert">
                {submitError}
              </p>
            )}

            <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
              {step === 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!persona}
                  className="btn-primary flex items-center gap-2"
                  aria-label={t("flow.nextStep")}
                >
                  {t("flow.nextStep")}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : step === 2 && persona === "alevel" ? (
                <button
                  onClick={handleNext}
                  disabled={selectedSubjects.length < 2}
                  className="btn-primary flex items-center gap-2"
                  aria-label={t("flow.nextStep")}
                >
                  {t("flow.nextStep")}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : step === 3 && persona === "alevel" ? (
                <button
                  onClick={handleSubmit}
                  disabled={interest.length === 0}
                  className="btn-primary bg-orange-500 hover:bg-orange-400 flex items-center gap-2"
                  aria-label="Submit for recommendations"
                >
                  {t("flow.submit")}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* SEO / resources below fold */}
        <section className="max-w-2xl mx-auto mt-16 px-4">
          <div className="bg-slate-50 rounded-xl p-7 mb-10 border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              {t("flow.benefits.heading")}
            </h2>
            <ul className="space-y-3">
              {[
                {
                  label: t("flow.benefits.saveTime.label"),
                  detail: t("flow.benefits.saveTime.detail"),
                },
                {
                  label: t("flow.benefits.hiddenPaths.label"),
                  detail: t("flow.benefits.hiddenPaths.detail"),
                },
                {
                  label: t("flow.benefits.concours.label"),
                  detail: t("flow.benefits.concours.detail"),
                },
              ].map(({ label, detail }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-800">{label}:</strong>{" "}
                    {detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <FAQBlock faqs={recommenderFaqs} title={t("flow.faq.title")} />
        </section>
      </main>
    </Layout>
  );
};

export default InputFlow;

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  User,
  Wrench,
  LineChart,
  Check,
} from "lucide-react";
import Layout from "../components/Layout";
import ProgressBar from "../components/ProgressBar";
import SubjectSelector from "../components/SubjectSelector";
import TradeSelector from "../components/TradeSelector";
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
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-orange-200 hover:bg-orange-50/10"
    }`}
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        selected
          ? "bg-orange-500 text-white"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500"
      }`}
    >
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <h3
        className={`font-bold text-sm transition-colors ${selected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:hover:text-white dark:text-white"}`}
      >
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
        {subtitle}
      </p>
    </div>
    <div
      className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
        selected
          ? "bg-orange-500 ring-2 ring-orange-500 ring-offset-2"
          : "border-2 border-slate-300 dark:border-slate-600 group-hover:border-orange-300"
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
  
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step")) || 1;
  const [direction, setDirection] = useState(1);
  const prevStepRef = useRef(step);

  useEffect(() => {
    if (step > prevStepRef.current) {
      setDirection(1);
    } else if (step < prevStepRef.current) {
      setDirection(-1);
    }
    prevStepRef.current = step;
  }, [step]);

  const setStep = (newStep, replace = false) => {
    setSearchParams(prev => {
      prev.set("step", newStep.toString());
      return prev;
    }, { replace });
  };

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [persona, setPersona] = useState(() => sessionStorage.getItem('flow_persona') || "");
  const [track, setTrack] = useState(() => sessionStorage.getItem('flow_track') || "");
  const [selectedSubjects, setSelectedSubjects] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('flow_subjects')) || []; } catch { return []; }
  });
  const [interest, setInterest] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('flow_interest')) || []; } catch { return []; }
  });

  useEffect(() => {
    sessionStorage.setItem('flow_persona', persona);
    sessionStorage.setItem('flow_track', track);
    sessionStorage.setItem('flow_subjects', JSON.stringify(selectedSubjects));
    sessionStorage.setItem('flow_interest', JSON.stringify(interest));
  }, [persona, track, selectedSubjects, interest]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/flow" } });
    }
  }, [authLoading, user, navigate]);

  const handleNext = () => {
    if (step === 1 && persona) {
      setStep(2);
    } else if (step === 2 && persona === "highschool" && track) {
      setStep(3);
    } else if (step === 3 && persona === "highschool") {
      if (track === "technical" && selectedSubjects.length >= 1) {
        setStep(4);
      } else if (track !== "technical" && selectedSubjects.length >= 2) {
        setStep(4);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      navigate(-1);
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
        education_system: track,
      });
      navigate("/results", {
        state: { results: data, subjects: selectedSubjects, interest, persona, track },
      });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: "/flow" } });
      } else {
        setSubmitError("Failed to get recommendations. Please try again.");
      }
    } finally {
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
    { question: t("flow.faq.q1"), answer: t("flow.faq.a1") },
    { question: t("flow.faq.q2"), answer: t("flow.faq.a2") },
    { question: t("flow.faq.q3"), answer: t("flow.faq.a3") },
    { question: t("flow.faq.q4"), answer: t("flow.faq.a4") },
  ];

  if (authLoading || !user) {
    return null;
  }

  const totalSteps = (!persona || persona === "highschool") ? 4 : 2;

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
        <section className="max-w-2xl mx-auto px-4 mb-10">
          <span className="section-eyebrow block mb-3">
            {t("flow.intro.eyebrow")}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {t("flow.intro.heading")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            {t("flow.intro.text")}
          </p>
        </section>

        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:text-white transition-colors mb-6 focus:outline-none"
            aria-label={t("flow.backAria")}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {step === 1 ? t("flow.backHome") : t("flow.previousStep")}
          </button>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 sm:p-7 md:p-9 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[400px] flex flex-col">
            <ProgressBar currentStep={step} totalSteps={totalSteps} />

            <div className="flex-1 relative mt-2">
              <AnimatePresence mode="wait" custom={direction}>
                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {t("flow.step1.title")}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                      {t("flow.step1.subtitle")}
                    </p>

                    <div className="space-y-3">
                      <PersonaButton
                        icon={GraduationCap}
                        title={t("flow.persona.highschool.title")}
                        subtitle={t("flow.persona.highschool.subtitle")}
                        selected={persona === "highschool"}
                        onClick={() => {
                          if (persona !== "highschool") {
                            setPersona("highschool");
                            setTrack("");
                            setSelectedSubjects([]);
                            setInterest([]);
                          }
                        }}
                      />
                      <PersonaButton
                        icon={BookOpen}
                        title={t("flow.persona.graduate.title")}
                        subtitle={t("flow.persona.graduate.subtitle")}
                        selected={persona === "graduate"}
                        onClick={() => {
                          if (persona !== "graduate") {
                            setPersona("graduate");
                            setTrack("");
                            setSelectedSubjects([]);
                            setInterest([]);
                          }
                        }}
                      />
                      <PersonaButton
                        icon={User}
                        title={t("flow.persona.professional.title")}
                        subtitle={t("flow.persona.professional.subtitle")}
                        selected={persona === "professional"}
                        onClick={() => {
                          if (persona !== "professional") {
                            setPersona("professional");
                            setTrack("");
                            setSelectedSubjects([]);
                            setInterest([]);
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {persona === "highschool" ? (
                      <>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                          {t("flow.step2_track.title")}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                          {t("flow.step2_track.subtitle")}
                        </p>

                        <div className="space-y-3">
                          <PersonaButton
                            icon={GraduationCap}
                            title={t("flow.track.grammar.title")}
                            subtitle={t("flow.track.grammar.subtitle")}
                            selected={track === "grammar"}
                            onClick={() => {
                              if (track !== "grammar") {
                                setTrack("grammar");
                                setSelectedSubjects([]);
                              }
                            }}
                          />
                          <PersonaButton
                            icon={LineChart}
                            title={t("flow.track.commercial.title")}
                            subtitle={t("flow.track.commercial.subtitle")}
                            selected={track === "commercial"}
                            onClick={() => {
                              if (track !== "commercial") {
                                setTrack("commercial");
                                setSelectedSubjects([]);
                              }
                            }}
                          />
                          <PersonaButton
                            icon={Wrench}
                            title={t("flow.track.technical.title")}
                            subtitle={t("flow.track.technical.subtitle")}
                            selected={track === "technical"}
                            onClick={() => {
                              if (track !== "technical") {
                                setTrack("technical");
                                setSelectedSubjects([]);
                              }
                            }}
                          />
                        </div>
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
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                          {t("flow.step3.comingSoon.title")}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
                          {t("flow.step3.comingSoon.text", {
                            audience:
                              persona === "graduate"
                                ? t("flow.step3.comingSoon.gradAudience")
                                : t("flow.step3.comingSoon.profAudience"),
                          })}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step === 3 && persona === "highschool" && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {track === "technical" ? (
                      <>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                          {t("flow.step3.tvee.title")}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                          {t("flow.step3.tvee.subtitle")}
                        </p>

                        <TradeSelector
                          selected={selectedSubjects}
                          onChange={setSelectedSubjects}
                        />

                        {selectedSubjects.length === 0 && (
                          <p className="text-xs text-orange-500 mt-4" role="alert">
                            {t("flow.step3.tvee.minSubjects")}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                          {t("flow.step3.alevel.title")}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                          {t("flow.step3.alevel.subtitle")}
                        </p>

                        <SubjectSelector
                          track={track}
                          selected={selectedSubjects}
                          onChange={setSelectedSubjects}
                        />

                        {selectedSubjects.length > 0 && selectedSubjects.length < 2 && (
                          <p className="text-xs text-orange-500 mt-4" role="alert">
                            {t("flow.step3.alevel.minSubjects")}
                          </p>
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* STEP 4 */}
                {step === 4 && persona === "highschool" && (
                  <motion.div
                    key="step4"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {t("flow.step4.title")}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-7">
                      {t("flow.step4.subtitle")}
                    </p>

                    <InterestSelector
                      selected={interest}
                      onChange={setInterest}
                    />

                    {interest.length === 0 && (
                      <p className="text-xs text-orange-500 mt-4" role="alert">
                        {t("flow.step4.minInterest")}
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

            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end">
              {step === 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!persona}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-3.5"
                  aria-label={t("flow.nextStep")}
                >
                  {t("flow.nextStep")}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : step === 2 && persona === "highschool" ? (
                <button
                  onClick={handleNext}
                  disabled={!track}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-3.5"
                  aria-label={t("flow.nextStep")}
                >
                  {t("flow.nextStep")}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : step === 3 && persona === "highschool" ? (
                <button
                  onClick={handleNext}
                  disabled={track === "technical" ? selectedSubjects.length < 1 : selectedSubjects.length < 2}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-3.5"
                  aria-label={t("flow.nextStep")}
                >
                  {t("flow.nextStep")}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : step === 4 && persona === "highschool" ? (
                <button
                  onClick={handleSubmit}
                  disabled={interest.length === 0}
                  className="btn-primary w-full sm:w-auto bg-orange-500 hover:bg-orange-400 flex items-center justify-center gap-2 py-3.5"
                  aria-label="Submit for recommendations"
                >
                  {t("flow.submit")}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <section className="max-w-2xl mx-auto mt-16 px-4">
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-7 mb-10 border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {t("flow.benefits.heading")}
            </h2>
            <ul className="space-y-3">
              {[
                { label: t("flow.benefits.saveTime.label"), detail: t("flow.benefits.saveTime.detail") },
                { label: t("flow.benefits.hiddenPaths.label"), detail: t("flow.benefits.hiddenPaths.detail") },
                { label: t("flow.benefits.concours.label"), detail: t("flow.benefits.concours.detail") },
              ].map(({ label, detail }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-orange-600" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">{label}:</strong> {detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <FAQBlock faqs={recommenderFaqs} />
        </section>
      </main>
    </Layout>
  );
};

export default InputFlow;

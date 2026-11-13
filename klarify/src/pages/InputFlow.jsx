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
import SkillSelector from "../components/SkillSelector";
import SkillPreferenceSelector from "../components/SkillPreferenceSelector";
import InterestSelector from "../components/InterestSelector";
import LoadingScreen from "../components/LoadingScreen";
import SEOHead from "../components/SEOHead";
import FAQBlock from "../components/FAQBlock";
import { getRecommendations } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const PersonaButton = ({ icon: Icon, title, subtitle, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center gap-4 p-5 rounded-[1.75rem] border transition-all duration-200 cursor-pointer ${
      selected
        ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 shadow-xs ring-1 ring-primary-500/40"
        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
    }`}
  >
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
        selected
          ? "bg-primary-500 text-white font-black shadow-xs"
          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/60 group-hover:text-slate-900 dark:group-hover:text-white"
      }`}
    >
      <Icon size={20} />
    </div>
    <div className="flex-1 text-left min-w-0">
      <h3
        className={`font-bold text-sm sm:text-base transition-colors ${selected ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-white"}`}
      >
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
        {subtitle}
      </p>
    </div>
    <div
      className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
        selected
          ? "bg-primary-500 text-white shadow-xs"
          : "border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
      }`}
    >
      {selected && (
        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 10 10" fill="none">
          <path
            d="M1.5 5L4 7.5L8.5 2.5"
            stroke="currentColor"
            strokeWidth="1.8"
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
  const [userSkills, setUserSkills] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('flow_user_skills')) || []; } catch { return []; }
  });
  const [skillPreferences, setSkillPreferences] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('flow_user_preferences')) || { workMode: "all", preferredCity: "Douala", budgetType: "all" }; } catch { return { workMode: "all", preferredCity: "Douala", budgetType: "all" }; }
  });

  useEffect(() => {
    sessionStorage.setItem('flow_persona', persona);
    sessionStorage.setItem('flow_track', track);
    sessionStorage.setItem('flow_subjects', JSON.stringify(selectedSubjects));
    sessionStorage.setItem('flow_interest', JSON.stringify(interest));
    sessionStorage.setItem('flow_user_skills', JSON.stringify(userSkills));
    sessionStorage.setItem('flow_user_preferences', JSON.stringify(skillPreferences));
  }, [persona, track, selectedSubjects, interest, userSkills, skillPreferences]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/flow" } });
    }
  }, [authLoading, user, navigate]);

  const handleNext = () => {
    if (step === 1 && persona) {
      setStep(2);
    } else if (step === 2) {
      if (persona === "highschool" && track) {
        setStep(3);
      } else if (persona === "professional" && userSkills.length >= 1) {
        setStep(3);
      }
    } else if (step === 3 && persona === "highschool") {
      if (track === "technical" && selectedSubjects.length >= 1) {
        setStep(4);
      } else if (track !== "technical" && selectedSubjects.length >= 2) {
        setStep(4);
      }
    }
  };

  const handleSubmitSkills = () => {
    if (userSkills.length === 0) return;
    sessionStorage.setItem('flow_user_skills', JSON.stringify(userSkills));
    sessionStorage.setItem('flow_user_preferences', JSON.stringify(skillPreferences));
    navigate("/skills-results", {
      state: { skills: userSkills, preferences: skillPreferences },
    });
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
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

          <div className="bg-white dark:bg-[#0F1626] rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 min-h-[420px] flex flex-col">
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
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
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
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
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
                    ) : persona === "professional" ? (
                      <>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                          Select Your Current Skills
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                          Pick the tools and competencies you already have. We will evaluate market demand and map out the exact skills you need to land remote contracts and top local roles.
                        </p>

                        <SkillSelector
                          selectedSkills={userSkills}
                          onChange={setUserSkills}
                        />

                        {userSkills.length === 0 && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-4" role="alert">
                            Please select at least 1 skill to continue.
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center h-full">
                        <div className="w-14 h-14 bg-secondary-50 dark:bg-secondary-950/40 text-secondary-800 dark:text-secondary-300 rounded-xl flex items-center justify-center mb-5">
                          <BookOpen size={28} />
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
                          {t("flow.step3.comingSoon.title")}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
                          {t("flow.step3.comingSoon.text", {
                            audience: t("flow.step3.comingSoon.gradAudience"),
                          })}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {persona === "professional" ? (
                      <>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                          Work Mode & Learning Preferences
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                          Choose whether you want to prioritize global remote jobs in USD/EUR, local physical opportunities in Cameroon, or both.
                        </p>

                        <SkillPreferenceSelector
                          preferences={skillPreferences}
                          onChange={setSkillPreferences}
                        />
                      </>
                    ) : track === "technical" ? (
                      <>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
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
                          <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-4" role="alert">
                            {t("flow.step3.tvee.minSubjects")}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
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
                          <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-4" role="alert">
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
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
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
                      <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-4" role="alert">
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
              ) : step === 2 ? (
                <button
                  onClick={handleNext}
                  disabled={persona === "highschool" ? !track : userSkills.length === 0}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 cursor-pointer disabled:opacity-50"
                  aria-label={t("flow.nextStep")}
                >
                  {t("flow.nextStep")}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : step === 3 && persona === "professional" ? (
                <button
                  onClick={handleSubmitSkills}
                  disabled={userSkills.length === 0}
                  className="btn-secondary w-full sm:w-auto bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-black flex items-center justify-center gap-2 py-3.5 shadow-lg shadow-secondary-500/25 cursor-pointer"
                >
                  Generate Career Blueprint
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
                  className="btn-secondary w-full sm:w-auto bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-black flex items-center justify-center gap-2 py-3.5 shadow-lg shadow-secondary-500/25 cursor-pointer"
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
                  <div className="w-5 h-5 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-secondary-700 dark:text-secondary-400" />
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

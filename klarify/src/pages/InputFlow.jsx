import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
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
  Sparkles,
  Award,
  Compass,
  Briefcase,
  ChevronRight,
  Layers,
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

const PersonaCard = ({
  icon: Icon,
  badge,
  title,
  subtitle,
  highlight,
  selected,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative w-full flex flex-col justify-between p-5 sm:p-6 rounded-3xl border text-left transition-all duration-200 cursor-pointer select-none min-h-[180px] sm:min-h-[220px] ${
      selected
        ? "border-secondary-500 bg-secondary-500/10 dark:bg-secondary-500/15 shadow-md shadow-secondary-500/10 ring-2 ring-secondary-500"
        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 hover:shadow-xs"
    }`}
  >
    <div className="flex items-start justify-between w-full mb-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
          selected
            ? "bg-secondary-500 text-slate-950 font-black shadow-xs"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/60 group-hover:text-primary-600 dark:group-hover:text-secondary-400"
        }`}
      >
        <Icon size={24} />
      </div>

      <div className="flex items-center gap-2">
        {badge && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {badge}
          </span>
        )}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
            selected
              ? "bg-secondary-500 text-slate-950 border-secondary-500 shadow-xs"
              : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
          }`}
        >
          {selected && <Check size={14} className="stroke-[3]" />}
        </div>
      </div>
    </div>

    <div>
      <h3
        className={`font-bold text-base sm:text-lg mb-1.5 transition-colors ${
          selected
            ? "text-slate-900 dark:text-white"
            : "text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-secondary-400"
        }`}
      >
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
        {subtitle}
      </p>

      {highlight && (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 dark:text-secondary-400">
          <Sparkles size={12} />
          {highlight}
        </span>
      )}
    </div>
  </button>
);

const TrackCard = ({
  icon: Icon,
  badge,
  title,
  subtitle,
  selected,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative w-full flex flex-col justify-between p-5 sm:p-6 rounded-3xl border text-left transition-all duration-200 cursor-pointer select-none min-h-[160px] sm:min-h-[190px] ${
      selected
        ? "border-secondary-500 bg-secondary-500/10 dark:bg-secondary-500/15 shadow-md shadow-secondary-500/10 ring-2 ring-secondary-500"
        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 hover:shadow-xs"
    }`}
  >
    <div className="flex items-start justify-between w-full mb-3">
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
          selected
            ? "bg-secondary-500 text-slate-950 font-black shadow-xs"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-primary-600"
        }`}
      >
        <Icon size={22} />
      </div>

      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
          selected
            ? "bg-secondary-500 text-slate-950 border-secondary-500 shadow-xs"
            : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
        }`}
      >
        {selected && <Check size={14} className="stroke-[3]" />}
      </div>
    </div>

    <div>
      <h3
        className={`font-bold text-base mb-1 transition-colors ${
          selected
            ? "text-slate-900 dark:text-white"
            : "text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-secondary-400"
        }`}
      >
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {subtitle}
      </p>
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const setStep = (newStep, replace = false) => {
    setSearchParams(
      (prev) => {
        prev.set("step", newStep.toString());
        return prev;
      },
      { replace }
    );
  };

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [persona, setPersona] = useState(
    () => sessionStorage.getItem("flow_persona") || ""
  );
  const [track, setTrack] = useState(
    () => sessionStorage.getItem("flow_track") || ""
  );
  const [selectedSubjects, setSelectedSubjects] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("flow_subjects")) || [];
    } catch {
      return [];
    }
  });
  const [interest, setInterest] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("flow_interest")) || [];
    } catch {
      return [];
    }
  });
  const [userSkills, setUserSkills] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("flow_user_skills")) || [];
    } catch {
      return [];
    }
  });
  const [skillPreferences, setSkillPreferences] = useState(() => {
    try {
      return (
        JSON.parse(sessionStorage.getItem("flow_user_preferences")) || {
          targetDirection: "all",
          opportunityGoal: "all",
          experienceLevel: "self_taught",
          workMode: "all",
          preferredCity: "Douala",
          budgetType: "all",
        }
      );
    } catch {
      return {
        targetDirection: "all",
        opportunityGoal: "all",
        experienceLevel: "self_taught",
        workMode: "all",
        preferredCity: "Douala",
        budgetType: "all",
      };
    }
  });

  useEffect(() => {
    sessionStorage.setItem("flow_persona", persona);
    sessionStorage.setItem("flow_track", track);
    sessionStorage.setItem("flow_subjects", JSON.stringify(selectedSubjects));
    sessionStorage.setItem("flow_interest", JSON.stringify(interest));
    sessionStorage.setItem("flow_user_skills", JSON.stringify(userSkills));
    sessionStorage.setItem(
      "flow_user_preferences",
      JSON.stringify(skillPreferences)
    );
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
    sessionStorage.setItem("flow_user_skills", JSON.stringify(userSkills));
    sessionStorage.setItem(
      "flow_user_preferences",
      JSON.stringify(skillPreferences)
    );
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
        state: {
          results: data,
          subjects: selectedSubjects,
          interest,
          persona,
          track,
        },
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
    enter: (dir) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Klarify Academic Recommender",
    url: "https://www.klarifypath.com/flow",
    description:
      "Intelligent tool that recommends university programs, concours guides, and in-demand skills in Cameroon.",
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

  const totalSteps = !persona || persona === "highschool" ? 4 : 3;

  // Validation rules for Next / Submit action
  const canProceed = () => {
    if (step === 1) return !!persona;
    if (step === 2) {
      if (persona === "highschool") return !!track;
      if (persona === "professional") return userSkills.length >= 1;
      return true;
    }
    if (step === 3) {
      if (persona === "highschool") {
        return track === "technical"
          ? selectedSubjects.length >= 1
          : selectedSubjects.length >= 2;
      }
      if (persona === "professional") return userSkills.length >= 1;
    }
    if (step === 4) {
      return interest.length >= 1;
    }
    return false;
  };

  const getValidationHint = () => {
    if (step === 1 && !persona) return "Choose an option to continue";
    if (step === 2 && persona === "highschool" && !track)
      return "Select your educational track";
    if (step === 2 && persona === "professional" && userSkills.length === 0)
      return "Select at least 1 skill";
    if (step === 3 && persona === "highschool") {
      if (track === "technical" && selectedSubjects.length === 0)
        return "Select your trade specialty";
      if (track !== "technical" && selectedSubjects.length < 2)
        return "Select at least 2 subjects";
    }
    if (step === 4 && interest.length === 0) return "Select at least 1 interest";
    return "";
  };

  return (
    <Layout>
      <SEOHead
        title="Academic & Career Recommender | Klarify"
        description="Get personalized university program recommendations, concours guides, and in-demand skill paths in Cameroon."
        canonicalUrl="https://www.klarifypath.com/flow"
        structuredData={schemaData}
      />

      <AnimatePresence>
        {loading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <main className="w-full min-h-screen pt-2 pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar: Back & Progress Indicator */}
          <div className="flex items-center justify-between gap-4 py-4 mb-6 border-b border-slate-100 dark:border-slate-800/80">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer py-1.5 px-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={t("flow.backAria")}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>{step === 1 ? t("flow.backHome") : t("flow.previousStep")}</span>
            </button>

            {/* Step Counter Pill */}
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                Step <strong className="text-slate-900 dark:text-white">{step}</strong> of{" "}
                {totalSteps}
              </span>
              <div className="w-20 sm:w-28 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary-500 transition-all duration-300 ease-out"
                  style={{ width: `${Math.round((step / totalSteps) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Step Content (Open Canvas) */}
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              {/* STEP 1: PERSONA SELECTOR */}
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
                  <div className="mb-8">
                    <span className="text-xs font-black tracking-widest text-primary-600 dark:text-secondary-400 uppercase">
                      Personalized Guidance - Step 1
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                      {t("flow.step1.title")}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                      {t("flow.step1.subtitle")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <PersonaCard
                      icon={GraduationCap}
                      badge="GCE A-Level & TVEE"
                      title={t("flow.persona.highschool.title")}
                      subtitle="Preparing for or completed A-Levels (Grammar, Commercial, or TVEE Technical). Match with university degrees & professional concours."
                      highlight="Best for A-Level Orientation"
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

                    <PersonaCard
                      icon={BookOpen}
                      badge="Degrees & Concours"
                      title={t("flow.persona.graduate.title")}
                      subtitle="Undergraduate student or degree holder. Explore competitive civil service concours (ENAM, IRIC, FMSB), postgraduate master's degrees, or conversion paths."
                      highlight="Postgraduate & Concours"
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

                    <PersonaCard
                      icon={User}
                      badge="Tech, Trade & Remote"
                      title={t("flow.persona.professional.title")}
                      subtitle="Self-taught learner, developer, or practical builder. Assess your current tech skills, find bootcamps, internships, and land remote or local contracts."
                      highlight="Career & Skill Accelerator"
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

              {/* STEP 2: HIGH SCHOOL TRACK OR PROFESSIONAL SKILLS OR GRADUATE PATHS */}
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
                      <div className="mb-8">
                        <span className="text-xs font-black tracking-widest text-primary-600 dark:text-secondary-400 uppercase">
                          Academic Stream - Step 2
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                          {t("flow.step2_track.title")}
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                          {t("flow.step2_track.subtitle")}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <TrackCard
                          icon={GraduationCap}
                          title={t("flow.track.grammar.title")}
                          subtitle="Standard Arts and Sciences series (GCE A-Level). Matches to Medicine, Engineering, Law, Letters, and Core Sciences."
                          selected={track === "grammar"}
                          onClick={() => {
                            if (track !== "grammar") {
                              setTrack("grammar");
                              setSelectedSubjects([]);
                            }
                          }}
                        />
                        <TrackCard
                          icon={LineChart}
                          title={t("flow.track.commercial.title")}
                          subtitle="Accounting, Commerce, Economics series. Matches to Business Administration, Banking, Finance, and Corporate Management."
                          selected={track === "commercial"}
                          onClick={() => {
                            if (track !== "commercial") {
                              setTrack("commercial");
                              setSelectedSubjects([]);
                            }
                          }}
                        />
                        <TrackCard
                          icon={Wrench}
                          title={t("flow.track.technical.title")}
                          subtitle="Technical trades (Building, Electrical, Mechanics, IT). Matches to IUT, ENSET, Vocational engineering & polytechnics."
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
                      <div className="mb-8">
                        <span className="text-xs font-black tracking-widest text-primary-600 dark:text-secondary-400 uppercase">
                          Skill Inventory - Step 2
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                          Select Your Current Skills & Tools
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                          Pick the tools and competencies you already have. We will evaluate market demand and map out the exact skills you need to land remote contracts and top local roles.
                        </p>
                      </div>

                      <SkillSelector
                        selectedSkills={userSkills}
                        onChange={setUserSkills}
                      />
                    </>
                  ) : (
                    /* UNIVERSITY GRADUATE ACTION HUB */
                    <div>
                      <div className="mb-8">
                        <span className="text-xs font-black tracking-widest text-primary-600 dark:text-secondary-400 uppercase">
                          University Graduate Hub
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                          Where Do You Want to Take Your Degree?
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                          Whether preparing for Cameroon competitive civil service exams, bridging into high-paying tech skills, or pursuing a master's, choose your target track:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                        {/* Option 1: Concours Guides */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-secondary-400 flex items-center justify-center mb-4 font-bold">
                              <Award size={24} />
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Official Concours
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3 mb-2">
                              Cameroon Concours Guides
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                              Access comprehensive syllabi, eligibility requirements, and past paper prep for ENAM, IRIC, ENS, FMSB specialization, and Police/Gendarmerie officer ranks.
                            </p>
                          </div>
                          <Link
                            to="/guides"
                            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm transition-colors"
                          >
                            <span>Explore Concours Guides</span>
                            <ArrowRight size={15} />
                          </Link>
                        </div>

                        {/* Option 2: Skill Gap Assessment */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border-2 border-secondary-500/80 flex flex-col justify-between shadow-md shadow-secondary-500/10">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-secondary-500 text-slate-950 flex items-center justify-center mb-4 font-bold shadow-xs">
                              <Sparkles size={24} />
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-secondary-100 dark:bg-secondary-900/50 text-secondary-900 dark:text-secondary-300">
                              Career Acceleration
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3 mb-2">
                              Skill Assessment & Tech Hubs
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                              Transition your degree into tech, business intelligence, or digital design. Assess your skills, find bootcamps (Seven Academy, ActivSpaces), and target remote jobs.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPersona("professional");
                              setStep(2);
                            }}
                            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-black text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Start Skill Assessment</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>

                        {/* Option 3: Master's Degrees */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mb-4 font-bold">
                              <GraduationCap size={24} />
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Postgraduate
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3 mb-2">
                              Accredited Master's Programs
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                              Explore master's degrees across Cameroon public universities (UB, UBa, Douala, Yaoundé I & II) and partner private IPES.
                            </p>
                          </div>
                          <Link
                            to="/programs"
                            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-colors"
                          >
                            <span>Browse All Programs</span>
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: HIGH SCHOOL SUBJECTS/TRADES OR PROFESSIONAL PREFERENCES */}
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
                      <div className="mb-8">
                        <span className="text-xs font-black tracking-widest text-primary-600 dark:text-secondary-400 uppercase">
                          Target Preferences - Step 3
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                          Work Mode & Opportunity Preferences
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                          Choose whether you want to prioritize global remote jobs in USD/EUR, local physical opportunities in Cameroon, or both.
                        </p>
                      </div>

                      <SkillPreferenceSelector
                        preferences={skillPreferences}
                        onChange={setSkillPreferences}
                      />
                    </>
                  ) : track === "technical" ? (
                    <>
                      <div className="mb-8">
                        <span className="text-xs font-black tracking-widest text-primary-600 dark:text-secondary-400 uppercase">
                          Technical Specialty - Step 3
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                          {t("flow.step3.tvee.title")}
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                          {t("flow.step3.tvee.subtitle")}
                        </p>
                      </div>

                      <TradeSelector
                        selected={selectedSubjects}
                        onChange={setSelectedSubjects}
                      />
                    </>
                  ) : (
                    <>
                      <div className="mb-8">
                        <span className="text-xs font-black tracking-widest text-primary-600 dark:text-secondary-400 uppercase">
                          A-Level Subjects - Step 3
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                          {t("flow.step3.alevel.title")}
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                          {t("flow.step3.alevel.subtitle")}
                        </p>
                      </div>

                      <SubjectSelector
                        track={track}
                        selected={selectedSubjects}
                        onChange={setSelectedSubjects}
                      />
                    </>
                  )}
                </motion.div>
              )}

              {/* STEP 4: CAREER INTERESTS FOR HIGH SCHOOL */}
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
                  <div className="mb-8">
                    <span className="text-xs font-black tracking-widest text-primary-600 dark:text-secondary-400 uppercase">
                      Career Interests - Step 4
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
                      {t("flow.step4.title")}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                      {t("flow.step4.subtitle")}
                    </p>
                  </div>

                  <InterestSelector
                    selected={interest}
                    onChange={setInterest}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {submitError && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-sm font-medium">
              {submitError}
            </div>
          )}

          {/* Benefits & FAQ block */}
          <section className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                <div
                  key={label}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-secondary-500 text-slate-950 flex items-center justify-center shrink-0">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                    {label}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {detail}
                  </p>
                </div>
              ))}
            </div>

            <FAQBlock faqs={recommenderFaqs} />
          </section>
        </div>
      </main>

      {/* MOBILE-FIRST STICKY BOTTOM ACTION BAR */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A0E17]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-4 py-3 sm:py-4 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Back Action */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Right: Primary Step Progression or Submission */}
          <div className="flex items-center gap-3">
            {!canProceed() && getValidationHint() && (
              <span className="hidden md:inline text-xs font-semibold text-amber-500">
                {getValidationHint()}
              </span>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 sm:px-8 rounded-2xl bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
                aria-label={t("flow.nextStep")}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : step === 2 ? (
              persona === "graduate" ? null : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 sm:px-8 rounded-2xl bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
                  aria-label={t("flow.nextStep")}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              )
            ) : step === 3 && persona === "professional" ? (
              <button
                type="button"
                onClick={handleSubmitSkills}
                disabled={!canProceed()}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 sm:px-8 rounded-2xl bg-secondary-500 hover:bg-secondary-400 disabled:opacity-40 text-slate-950 font-black text-sm shadow-md shadow-secondary-500/25 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Generate Career Blueprint</span>
                <ArrowRight size={16} />
              </button>
            ) : step === 3 && persona === "highschool" ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 sm:px-8 rounded-2xl bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
                aria-label={t("flow.nextStep")}
              >
                <span>Continue to Interests</span>
                <ArrowRight size={16} />
              </button>
            ) : step === 4 && persona === "highschool" ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 sm:px-8 rounded-2xl bg-secondary-500 hover:bg-secondary-400 disabled:opacity-40 text-slate-950 font-black text-sm shadow-md shadow-secondary-500/25 transition-all cursor-pointer disabled:cursor-not-allowed"
                aria-label="Submit for recommendations"
              >
                <span>{t("flow.submit")}</span>
                <ArrowRight size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default InputFlow;

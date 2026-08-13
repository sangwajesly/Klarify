import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, GraduationCap, BookOpen, User } from 'lucide-react';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import SubjectSelector from '../components/SubjectSelector';
import InterestSelector from '../components/InterestSelector';
import LoadingScreen from '../components/LoadingScreen';
import SEOHead from '../components/SEOHead';
import FAQBlock from '../components/FAQBlock';
import { getRecommendations } from '../services/api';

const PersonaButton = ({ icon: Icon, title, subtitle, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
      selected
        ? 'border-orange-500 bg-orange-50/40 shadow-sm'
        : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/10'
    }`}
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        selected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-500'
      }`}
    >
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <h3 className={`font-bold text-sm transition-colors ${selected ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>{title}</h3>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>
    </div>
    <div className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
      selected 
        ? 'bg-orange-500 ring-2 ring-orange-500 ring-offset-2' 
        : 'border-2 border-slate-300 group-hover:border-orange-300'
    }`}>
      {selected && (
        <svg className="w-3 h-3 text-white" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  </button>
);

const InputFlow = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [persona, setPersona] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [interest, setInterest] = useState([]);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/flow' } });
    }
  }, [authLoading, user, navigate]);

  const handleNext = () => {
    if (step === 1 && persona) {
      setStep(2);
    } else if (step === 2 && persona === 'alevel' && selectedSubjects.length >= 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async () => {
    if (interest.length === 0) return;

    setLoading(true);
    setSubmitError('');
    try {
      const data = await getRecommendations({
        subjects: selectedSubjects,
        interest: interest
      });
      navigate('/results', { state: { results: data, subjects: selectedSubjects, interest } });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: '/flow' } });
      } else {
        setSubmitError('Failed to get recommendations. Please try again.');
      }
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 40 : -40,
      opacity: 0
    })
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "KlarifyPath AI Career Recommender",
    "url": "https://www.klarifypath.com/flow",
    "description": "AI-powered tool that recommends university programs and career paths in Cameroon based on GCE A-Level subjects.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All"
  };

  const recommenderFaqs = [
    {
      question: "How are the university programs recommended?",
      answer: "Our AI engine uses advanced natural language processing (TF-IDF and Cosine Similarity) to match your A-Level subjects and personal interests against a database of hundreds of university programs across Cameroon."
    },
    {
      question: "What information do I need to provide?",
      answer: "You only need to select at least 2 A-Level subjects you have studied and select your broad fields of interest (e.g., Technology, Health, Business)."
    },
    {
      question: "Are these recommendations guaranteed for admission?",
      answer: "The recommendations show what programs you are academically eligible for. However, admission depends on your final grades and performance in any required concours (entrance exams)."
    },
    {
      question: "What if my desired career isn't listed?",
      answer: "Our database is constantly updating. If you don't see a specific niche, try selecting a broader category like 'Sciences' or 'Arts' to see foundational degrees that lead to your desired career."
    }
  ];

  if (authLoading || !user) {
    return null;
  }

  return (
    <Layout>
      <SEOHead
        title="AI Career & University Recommender Cameroon"
        description="Get personalized university program and career recommendations in Cameroon based on your GCE A-Level subjects using our advanced AI matching engine."
        canonicalUrl="https://www.klarifypath.com/flow"
        structuredData={schemaData}
      />

      <AnimatePresence>
        {loading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <main className="pt-4 pb-16">
        {/* Intro */}
        <section className="max-w-2xl mx-auto px-4 mb-10">
          <span className="section-eyebrow block mb-3">AI Recommender</span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Discover Your Perfect Academic Path
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            By analyzing your exact profile and personal interests, we match you with the most suitable
            degrees, HNDs, and professional concours available across the national territory.
          </p>
        </section>

        {/* Recommender card */}
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 focus:outline-none"
            aria-label="Go back to previous step"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {step === 1 ? 'Back to Home' : 'Previous Step'}
          </button>

          <div className="bg-white rounded-2xl p-7 md:p-9 shadow-sm border border-slate-100 min-h-[380px] flex flex-col">
            {persona === 'alevel' && <ProgressBar currentStep={step} totalSteps={3} />}
            {(!persona || persona !== 'alevel') && <ProgressBar currentStep={step} totalSteps={2} />}

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
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Which best describes you?</h2>
                    <p className="text-slate-500 text-sm mb-7">Select your current academic or professional status to tailor your recommendations.</p>

                    <div className="space-y-3">
                      <PersonaButton
                        icon={GraduationCap}
                        title="Secondary School Student"
                        subtitle="I have written or am preparing for the GCE A-Levels."
                        selected={persona === 'alevel'}
                        onClick={() => setPersona('alevel')}
                      />
                      <PersonaButton
                        icon={BookOpen}
                        title="University Graduate"
                        subtitle="I have a degree and am looking for postgraduate options."
                        selected={persona === 'graduate'}
                        onClick={() => setPersona('graduate')}
                      />
                      <PersonaButton
                        icon={User}
                        title="Self-Learner / Professional"
                        subtitle="I want to upskill or find professional certification paths."
                        selected={persona === 'professional'}
                        onClick={() => setPersona('professional')}
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
                    {persona === 'alevel' ? (
                      <>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">Select Your A-Level Subjects</h2>
                        <p className="text-slate-500 text-sm mb-7">Choose at least 2 subjects you studied for your Advanced Levels.</p>

                        <SubjectSelector
                          selected={selectedSubjects}
                          onChange={setSelectedSubjects}
                        />

                        {selectedSubjects.length > 0 && selectedSubjects.length < 2 && (
                          <p className="text-xs text-orange-500 mt-4" role="alert">Please select at least 2 subjects.</p>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center h-full">
                        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-5">
                          {persona === 'graduate' ? <BookOpen size={28} /> : <User size={28} />}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Coming Soon</h2>
                        <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                          We are currently fine-tuning our AI recommendation engine for{" "}
                          {persona === 'graduate' ? 'University Graduates' : 'Professionals and Self-Learners'}.
                          This feature will be available very soon. Stay tuned!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: Interests */}
                {step === 3 && persona === 'alevel' && (
                  <motion.div
                    key="step3"
                    custom={1}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-1">What fields are you interested in?</h2>
                    <p className="text-slate-500 text-sm mb-7">Select one or more career paths or topics you are passionate about.</p>

                    <InterestSelector
                      selected={interest}
                      onChange={setInterest}
                    />

                    {interest.length === 0 && (
                      <p className="text-xs text-orange-500 mt-4" role="alert">Please select at least 1 field of interest.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {submitError && (
              <p className="text-xs text-red-500 mt-3" role="alert">{submitError}</p>
            )}

            <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
              {step === 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!persona}
                  className="btn-primary flex items-center gap-2"
                  aria-label="Proceed to next step"
                >
                  Next Step
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : step === 2 && persona === 'alevel' ? (
                <button
                  onClick={handleNext}
                  disabled={selectedSubjects.length < 2}
                  className="btn-primary flex items-center gap-2"
                  aria-label="Proceed to next step"
                >
                  Next Step
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : step === 3 && persona === 'alevel' ? (
                <button
                  onClick={handleSubmit}
                  disabled={interest.length === 0}
                  className="btn-primary bg-orange-500 hover:bg-orange-400 flex items-center gap-2"
                  aria-label="Submit for recommendations"
                >
                  Get My Recommendations
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* SEO / resources below fold */}
        <section className="max-w-2xl mx-auto mt-16 px-4">
          <div className="bg-slate-50 rounded-xl p-7 mb-10 border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-4">Why use our Recommender?</h2>
            <ul className="space-y-3">
              {[
                { label: "Save Time", detail: "Stop manually reading through hundreds of university brochures." },
                { label: "Discover Hidden Paths", detail: "Find programs you didn't know existed but perfectly match your skills." },
                { label: "Concours Awareness", detail: "Instantly know which professional schools (like ENS or FMSB) require competitive exams." },
              ].map(({ label, detail }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                  <p className="text-sm text-slate-600"><strong className="text-slate-800">{label}:</strong> {detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <FAQBlock faqs={recommenderFaqs} title="Recommender FAQs" />
        </section>
      </main>
    </Layout>
  );
};

export default InputFlow;

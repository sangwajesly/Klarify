import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import SubjectSelector from '../components/SubjectSelector';
import InterestSelector from '../components/InterestSelector';
import LoadingScreen from '../components/LoadingScreen';
import SEOHead from '../components/SEOHead';
import FAQBlock from '../components/FAQBlock';
import { getRecommendations } from '../services/api';

const InputFlow = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [interest, setInterest] = useState([]);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/flow' } });
    }
  }, [authLoading, user, navigate]);

  const handleNext = () => {
    if (step === 1 && selectedSubjects.length >= 2) {
      setStep(2);
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
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
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
    return null; // Will redirect in useEffect
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

      <main className="pt-8 pb-16">
        {/* SEO Intro Block */}
        <section className="max-w-3xl mx-auto px-4 text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Discover Your Perfect Academic Path</h1>
          <p className="text-lg text-slate-600 mb-4">
            Welcome to the KlarifyPath AI Recommender. This tool is designed exclusively for Cameroonian A-Level students. 
            By analyzing your exact subject combinations and personal interests, we match you with the most suitable degrees, 
            HNDs, and professional concours available across the national territory.
          </p>
        </section>

        {/* The Recommender Application */}
        <div className="max-w-2xl mx-auto px-4">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8 focus:outline-none"
            aria-label="Go back to previous step"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {step === 1 ? 'Back to Home' : 'Previous Step'}
          </button>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[400px] flex flex-col relative z-10">
            <ProgressBar currentStep={step} totalSteps={2} />

            <div className="flex-1 relative mt-4">
              <AnimatePresence mode="wait" custom={step}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={1}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Select Your A-Level Subjects</h2>
                    <p className="text-slate-500 mb-8">Choose at least 2 subjects you studied for your Advanced Levels.</p>
                    
                    <SubjectSelector 
                      selected={selectedSubjects} 
                      onChange={setSelectedSubjects} 
                    />
                    
                    {selectedSubjects.length > 0 && selectedSubjects.length < 2 && (
                      <p className="text-sm text-orange-500 mt-4" role="alert">Please select at least 2 subjects.</p>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={1}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">What fields are you interested in?</h2>
                    <p className="text-slate-500 mb-8">Select one or more career paths or topics you are passionate about.</p>
                    
                    <InterestSelector 
                      selected={interest} 
                      onChange={setInterest} 
                    />
                    
                    {interest.length === 0 && (
                      <p className="text-sm text-orange-500 mt-4" role="alert">Please select at least 1 field of interest.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {submitError && (
              <p className="text-sm text-red-500 mt-4" role="alert">{submitError}</p>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              {step === 1 ? (
                <button 
                  onClick={handleNext}
                  disabled={selectedSubjects.length < 2}
                  className="btn-primary flex items-center gap-2"
                  aria-label="Proceed to next step"
                >
                  Next Step
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={interest.length === 0}
                  className="btn-primary bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                  aria-label="Submit for recommendations"
                >
                  Get My Recommendations
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SEO Resources and FAQs Below the fold */}
        <section className="max-w-4xl mx-auto mt-20 px-4">
          <div className="bg-orange-50 rounded-2xl p-8 mb-12 border border-orange-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why use our Recommender?</h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                <p><strong>Save Time:</strong> Stop manually reading through hundreds of university brochures.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                <p><strong>Discover Hidden Paths:</strong> Find programs you didn't know existed but perfectly match your skills.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                <p><strong>Concours Awareness:</strong> Instantly know which professional schools (like ENS or FMSB) require competitive exams.</p>
              </li>
            </ul>
          </div>

          <FAQBlock faqs={recommenderFaqs} title="Recommender FAQs" />
        </section>
      </main>
    </Layout>
  );
};

export default InputFlow;

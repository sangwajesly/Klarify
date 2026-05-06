import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import SubjectSelector from '../components/SubjectSelector';
import InterestSelector from '../components/InterestSelector';
import LoadingScreen from '../components/LoadingScreen';
import { getRecommendations } from '../services/api';

const InputFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [interest, setInterest] = useState([]);

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
    try {
      const data = await getRecommendations({
        subjects: selectedSubjects,
        interest: interest
      });
      // Store data globally or pass via state
      navigate('/results', { state: { results: data, subjects: selectedSubjects, interest } });
    } catch (error) {
      console.error(error);
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

  return (
    <Layout>
      <AnimatePresence>
        {loading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {step === 1 ? 'Back to Home' : 'Previous Step'}
        </button>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[400px] flex flex-col">
          <ProgressBar currentStep={step} totalSteps={2} />

          <div className="flex-1 relative">
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
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Select Your A/L Subjects</h2>
                  <p className="text-slate-500 mb-8">Choose at least 2 subjects you studied for your Advanced Levels.</p>
                  
                  <SubjectSelector 
                    selected={selectedSubjects} 
                    onChange={setSelectedSubjects} 
                  />
                  
                  {selectedSubjects.length > 0 && selectedSubjects.length < 2 && (
                    <p className="text-sm text-orange-500 mt-4">Please select at least 2 subjects.</p>
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
                    <p className="text-sm text-orange-500 mt-4">Please select at least 1 field of interest.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            {step === 1 ? (
              <button 
                onClick={handleNext}
                disabled={selectedSubjects.length < 2}
                className="btn-primary flex items-center gap-2"
              >
                Next Step
                <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={interest.length === 0}
                className="btn-primary bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
              >
                Get My Recommendations
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InputFlow;

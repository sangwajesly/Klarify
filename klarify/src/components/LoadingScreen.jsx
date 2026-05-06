import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center max-w-sm w-full">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing your profile</h3>
        <p className="text-slate-500 text-sm">Our AI is matching your subjects and interests with the best academic paths.</p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;

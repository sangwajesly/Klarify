import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import ProgramCard from '../components/ProgramCard';
import Tabs from '../components/Tabs';

const FILTERS = ['All', 'Entrance Required', 'Upcoming Deadline'];

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, subjects, interest } = location.state || {};
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (!results) {
      navigate('/');
    }
  }, [results, navigate]);

  if (!results) return null;

  const filteredPrograms = results.programs.filter(program => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Entrance Required') return program.requiresConcours;
    if (activeFilter === 'Upcoming Deadline') return !!program.examDetails?.deadline;
    return true;
  });

  return (
    <Layout>
      <div className="mb-8">
        <button 
          onClick={() => navigate('/flow')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Modify Inputs
        </button>

        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <Sparkles size={20} />
              <span className="font-medium text-sm tracking-wide uppercase">Analysis Complete</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Your Personalized Academic Path</h1>
            <p className="text-slate-300 max-w-2xl">
              Based on your strong background in <span className="text-white font-medium">{subjects.join(', ')}</span> and interest in "<span className="text-white font-medium">{Array.isArray(interest) ? interest.join(', ') : interest}</span>", we've found the best matching programs for you.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Top Recommended Programs
              </h2>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                {FILTERS.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === filter
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500">No programs match the selected filter.</p>
                <button 
                  onClick={() => setActiveFilter('All')}
                  className="mt-4 text-orange-600 font-medium hover:text-orange-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <Tabs certifications={results.certifications} books={results.books} />
        </div>
      </div>
    </Layout>
  );
};

export default Results;

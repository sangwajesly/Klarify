import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import ProgramCard from '../components/ProgramCard';
import Tabs from '../components/Tabs';
import { useAuth } from '../context/AuthContext';
import { saveProgram, removeSavedProgram, getSavedPrograms } from '../services/api';

const TYPE_FILTERS = ['All', 'Entrance Required', 'Upcoming Deadline'];

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, subjects, interest } = location.state || {};
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
  
  const { user } = useAuth();
  const [savedProgramIds, setSavedProgramIds] = useState(new Set());

  // Fetch saved programs when results page loads
  useEffect(() => {
    const fetchSaved = async () => {
      if (user) {
        try {
          const saved = await getSavedPrograms(user.id);
          setSavedProgramIds(new Set(saved.map(s => s.id)));
        } catch (error) {
          console.error("Failed to fetch saved programs", error);
        }
      }
    };
    fetchSaved();
  }, [user]);

  const handleSaveProgram = async (programId) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      await saveProgram(user.id, programId);
      setSavedProgramIds(prev => {
        const newSet = new Set(prev);
        newSet.add(programId);
        return newSet;
      });
    } catch (error) {
      console.error("Failed to save program", error);
    }
  };

  const handleRemoveSavedProgram = async (programId) => {
    if (!user) return;
    try {
      await removeSavedProgram(user.id, programId);
      setSavedProgramIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(programId);
        return newSet;
      });
    } catch (error) {
      console.error("Failed to remove saved program", error);
    }
  };

  useEffect(() => {
    if (!results) {
      navigate('/');
    }
  }, [results, navigate]);

  // Extract unique universities from current recommendation results
  const universities = useMemo(() => {
    if (!results?.programs) return ['All Universities'];
    const set = new Set();
    results.programs.forEach(p => {
      if (p.university) set.add(p.university);
    });
    return ['All Universities', ...Array.from(set).sort()];
  }, [results]);

  if (!results) return null;

  const filteredPrograms = results.programs.filter(program => {
    // Filter by type
    if (activeFilter === 'Entrance Required' && !program.requiresConcours) return false;
    if (activeFilter === 'Upcoming Deadline' && !program.examDetails?.deadline) return false;

    // Filter by university
    if (selectedUniversity !== 'All Universities' && program.university !== selectedUniversity) {
      return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setActiveFilter('All');
    setSelectedUniversity('All Universities');
  };

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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200">
          <div>
            <span className="section-eyebrow block mb-2">Your Results</span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Your Personalized Academic Path</h1>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 md:max-w-md">
            <p className="text-xs text-slate-500 leading-relaxed">
              Based on your subjects <span className="text-slate-900 font-semibold">{subjects.join(', ')}</span> and interest in "<span className="text-slate-900 font-semibold">{Array.isArray(interest) ? interest.join(', ') : interest}</span>", we've found the best matching programs for you.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 shrink-0">
                Top Recommended Programs
              </h2>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* University Filter Dropdown */}
                {universities.length > 1 && (
                  <div className="relative shrink-0">
                    <select
                      value={selectedUniversity}
                      onChange={(e) => setSelectedUniversity(e.target.value)}
                      className="appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-slate-400 cursor-pointer shadow-xs transition-colors"
                      aria-label="Filter by University"
                    >
                      {universities.map(uni => (
                        <option key={uni} value={uni}>
                          {uni}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                )}

                {/* Type Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                  {TYPE_FILTERS.map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`whitespace-nowrap px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        activeFilter === filter
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredPrograms.map((program) => (
                  <ProgramCard 
                    key={program.id} 
                    program={program}
                    isSaved={savedProgramIds.has(program.id)}
                    onSave={handleSaveProgram}
                    onRemove={handleRemoveSavedProgram}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-500 text-sm">No programs match the selected filters.</p>
                <button 
                  onClick={handleClearFilters}
                  className="mt-3 text-orange-600 font-semibold text-sm hover:text-orange-700"
                >
                  Clear All Filters
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

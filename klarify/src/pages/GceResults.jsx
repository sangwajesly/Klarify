import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, GraduationCap, Building2, User, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import heroBg from "../assets/hero.jpg";

const GceResults = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [examYear, setExamYear] = useState('2025');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim().length < 3) {
      setError('Please enter at least 3 characters of your name.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSearched(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/gce/search?name=${encodeURIComponent(query)}&exam_year=${examYear}`);
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout noPadding={true}>
      <section className="relative min-h-screen flex flex-col items-center pt-28 px-6 overflow-hidden">
        {/* Hero Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Strongly Blurred Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-60"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundAttachment: "fixed",
            }}
          ></div>
          
          {/* Heavy Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/85 to-slate-900/95"></div>

          {/* Animated Decorative Blobs */}
          <div className="absolute top-20 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
          
          {/* Header Text */}
          <div className="w-full text-center space-y-6 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-2 hover:bg-white/15 transition-all">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Klarify Results Engine
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Check Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">GCE Results</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              No more scrolling through massive PDFs! Find your GCE results instantly in just a few seconds.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto mt-8 flex flex-col md:flex-row gap-4">
              
              {/* Year Selector */}
              <div className="relative min-w-[160px]">
                <select 
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="w-full px-6 py-5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-xl font-black text-center focus:outline-none focus:border-orange-500/50 transition-all shadow-2xl appearance-none cursor-pointer"
                >
                  <option value="2025" className="text-slate-900">2025</option>
                  <option value="2024" className="text-slate-900">2024</option>
                  <option value="2023" className="text-slate-900">2023</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-xs font-bold uppercase tracking-widest">
                  Year
                </div>
              </div>

              {/* Name Input */}
              <div className="relative flex-1 flex items-center group">
                <Search className="absolute left-6 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={24} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your full name (e.g. SANGWA JESLY)..."
                  className="w-full pl-16 pr-36 py-5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-lg focus:outline-none focus:border-orange-500/50 focus:bg-white/15 transition-all shadow-2xl placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-full transition-all flex items-center gap-2 shadow-lg shadow-orange-500/25 transform hover:scale-105"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
                </button>
              </div>
            </form>
            {error && <p className="text-red-400 mt-2 text-center font-medium">{error}</p>}
          </div>

          {/* Results Container */}
          <div className="w-full space-y-6 pb-20">
            {searched && !loading && results.length === 0 && !error && (
              <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl mt-8">
                <p className="text-2xl text-slate-300 font-medium">No results found for "{query}" in {examYear}.</p>
                <p className="text-slate-400 mt-4 max-w-md mx-auto">Make sure you spelled your name exactly as it appears on your official GCE registration slip.</p>
              </div>
            )}

            {results.map((result) => (
              <div key={result.id} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/15 transition-all transform hover:-translate-y-1 relative overflow-hidden group">
                {/* Result Accent Blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-orange-500/20 transition-colors"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-3xl font-bold text-white">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <User size={28} className="text-orange-400" />
                      </div>
                      {result.candidate_name}
                    </div>
                    <div className="flex items-center gap-3 text-lg text-slate-300">
                      <div className="p-1.5 bg-white/5 rounded-lg">
                        <Building2 size={20} className="text-slate-400" />
                      </div>
                      {result.center_number} - {result.center_name}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 px-8 py-4 rounded-2xl text-center min-w-[200px]">
                    <span className="block text-xs uppercase tracking-widest font-bold text-orange-300 mb-1">Status</span>
                    <span className="block text-2xl font-black text-white">{result.passed_category}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end relative z-10">
                  <button
                    onClick={() => navigate('/input-flow')}
                    className="flex items-center gap-3 text-orange-400 hover:text-orange-300 font-bold text-lg transition-colors group/btn"
                  >
                    Find Universities for this Profile
                    <GraduationCap size={24} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default GceResults;
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Award,
  Search,
  Loader2,
  BookOpen,
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import ProgramCard from "../components/ProgramCard";
import {
  fetchUniversityDetails,
  getSavedPrograms,
  saveProgram,
  removeSavedProgram,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const UniversityDetails = () => {
  const { id } = useParams();
  const uniName = decodeURIComponent(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaculty, setActiveFaculty] = useState("All");
  const [savedProgramIds, setSavedProgramIds] = useState(new Set());

  useEffect(() => {
    const loadUniDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchUniversityDetails(uniName);
        setDetails(data);

        if (user) {
          const saved = await getSavedPrograms(user.id);
          setSavedProgramIds(new Set(saved.map((s) => s.id)));
        }
      } catch (err) {
        console.error("Failed to load university details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUniDetails();
  }, [uniName, user]);

  const handleSaveProgram = async (programId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await saveProgram(user.id, programId);
      setSavedProgramIds((prev) => new Set([...prev, programId]));
    } catch (err) {
      console.error("Error saving program:", err);
    }
  };

  const handleRemoveSavedProgram = async (programId) => {
    if (!user) return;
    try {
      await removeSavedProgram(user.id, programId);
      setSavedProgramIds((prev) => {
        const next = new Set(prev);
        next.delete(programId);
        return next;
      });
    } catch (err) {
      console.error("Error removing program:", err);
    }
  };

  // Filter programs offered at this university
  const filteredPrograms = useMemo(() => {
    if (!details?.programs) return [];
    return details.programs.filter((p) => {
      if (activeFaculty !== "All" && p.faculty !== activeFaculty) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = p.name?.toLowerCase().includes(q);
        const facMatch = p.faculty?.toLowerCase().includes(q);
        const careerMatch = p.careers?.some((c) => c.toLowerCase().includes(q));
        if (!nameMatch && !facMatch && !careerMatch) return false;
      }
      return true;
    });
  }, [details, activeFaculty, searchQuery]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-28">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      </Layout>
    );
  }

  if (!details || !details.programs || details.programs.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            University Not Found
          </h1>
          <p className="text-slate-500 mb-6">
            No program details found for "{uniName}".
          </p>
          <button
            onClick={() => navigate("/universities")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-xl transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Universities Directory
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${uniName} - Programs & Faculties | Klarify`}
        description={`Explore degree programs, entrance exam courses, and faculties offered at ${uniName}.`}
        canonicalUrl={`https://www.klarifypath.com/universities/${encodeURIComponent(uniName)}`}
      />

      <main className="py-6 pb-20">
        {/* Back Link */}
        <button
          onClick={() => navigate("/universities")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Universities
        </button>

        {/* Hero Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-9 shadow-lg border border-slate-800 mb-8 relative overflow-hidden">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
              <Building2 size={28} />
            </div>
            <div>
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest block mb-1">
                State Institution Profile
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {uniName}
              </h1>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 max-w-xl">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Total Programs
              </span>
              <span className="block text-lg font-extrabold text-white">
                {details.programCount}
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Faculties/Schools
              </span>
              <span className="block text-lg font-extrabold text-white">
                {details.faculties.length}
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Concours Exams
              </span>
              <span className="block text-lg font-extrabold text-white">
                {details.concoursCount}
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs mb-8 space-y-4">
          <div className="relative w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search programs offered at ${uniName}...`}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Faculty Tabs */}
          {details.faculties.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pt-1">
              <button
                onClick={() => setActiveFaculty("All")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                  activeFaculty === "All"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Faculties ({details.programs?.length || 0})
              </button>
              {details.faculties.map((fac) => {
                const count = (details.programs || []).filter(
                  (p) => p.faculty === fac,
                ).length;
                return (
                  <button
                    key={fac}
                    onClick={() => setActiveFaculty(fac)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                      activeFaculty === fac
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {fac} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Program Cards Grid */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Programs Offered ({filteredPrograms.length})
          </h2>

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
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <BookOpen className="mx-auto text-slate-300 mb-3" size={40} />
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No programs found
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
                No programs match your search or faculty filter at {uniName}.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFaculty("All");
                }}
                className="text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default UniversityDetails;

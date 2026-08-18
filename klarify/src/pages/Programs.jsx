import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Filter,
  BookOpen,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Layout from "../components/Layout";
import ProgramCard from "../components/ProgramCard";
import SEOHead from "../components/SEOHead";
import { useAuth } from "../context/AuthContext";
import {
  getSavedPrograms,
  saveProgram,
  removeSavedProgram,
} from "../services/api";
import { usePrograms } from "../services/usePrograms";

const CATEGORY_TAGS = [
  "All",
  "Science",
  "Healthcare",
  "Technology",
  "Business",
  "Arts",
  "Engineering",
];

const Programs = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const {
    data: programsData,
    isLoading: programsLoading,
    refetch: refetchPrograms,
  } = usePrograms();
  const [loading, setLoading] = useState(true);
  const [savedProgramIds, setSavedProgramIds] = useState(new Set());

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] =
    useState("All Universities");
  const [selectedFaculty, setSelectedFaculty] = useState("All Faculties");
  const [selectedConcours, setSelectedConcours] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = programsData || [];
        setPrograms(data);

        if (user) {
          const saved = await getSavedPrograms(user.id);
          setSavedProgramIds(new Set(saved.map((s) => s.id)));
        }
      } catch (error) {
        console.error("Failed to load programs catalog:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Handle saving / un-saving programs
  const handleSaveProgram = async (programId) => {
    if (!user) {
      window.location.href = "/login";
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

  // Derive unique universities & faculties dropdown options
  const universities = useMemo(() => {
    const set = new Set();
    programs.forEach((p) => {
      if (p.university) set.add(p.university);
    });
    return ["All Universities", ...Array.from(set).sort()];
  }, [programs]);

  const faculties = useMemo(() => {
    const set = new Set();
    programs.forEach((p) => {
      if (
        selectedUniversity === "All Universities" ||
        p.university === selectedUniversity
      ) {
        if (p.faculty) set.add(p.faculty);
      }
    });
    return ["All Faculties", ...Array.from(set).sort()];
  }, [programs, selectedUniversity]);

  // Filtering logic
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = p.name?.toLowerCase().includes(q);
        const uniMatch = p.university?.toLowerCase().includes(q);
        const facMatch = p.faculty?.toLowerCase().includes(q);
        const careerMatch = p.careers?.some((c) => c.toLowerCase().includes(q));
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));

        if (!nameMatch && !uniMatch && !facMatch && !careerMatch && !tagMatch) {
          return false;
        }
      }

      // University filter
      if (
        selectedUniversity !== "All Universities" &&
        p.university !== selectedUniversity
      ) {
        return false;
      }

      // Faculty filter
      if (
        selectedFaculty !== "All Faculties" &&
        p.faculty !== selectedFaculty
      ) {
        return false;
      }

      // Concours filter
      if (selectedConcours === "Concours Required" && !p.requiresConcours)
        return false;
      if (selectedConcours === "Direct Entry" && p.requiresConcours)
        return false;

      // Category filter
      if (selectedCategory !== "All") {
        const cat = selectedCategory.toLowerCase();
        const hasTag = p.tags?.some((t) => t.toLowerCase().includes(cat));
        const hasDesc = p.descriptions?.toLowerCase().includes(cat);
        const hasName = p.name?.toLowerCase().includes(cat);
        if (!hasTag && !hasDesc && !hasName) return false;
      }

      return true;
    });
  }, [
    programs,
    searchQuery,
    selectedUniversity,
    selectedFaculty,
    selectedConcours,
    selectedCategory,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPrograms.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPrograms, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedUniversity("All Universities");
    setSelectedFaculty("All Faculties");
    setSelectedConcours("All");
    setSelectedCategory("All");
    setCurrentPage(1);
  };

  return (
    <Layout>
      <SEOHead
        title="Academic Programs & Degrees in Cameroon | KlarifyPath"
        description="Browse hundreds of university degree programs, HNDs, and professional courses across public and private universities in Cameroon."
        canonicalUrl="https://www.klarifypath.com/programs"
      />

      <main className="py-6 pb-20">
        {/* Header */}
        <div className="mb-8">
          <span className="section-eyebrow block mb-2">Program Directory</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Academic Programs in Cameroon
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore bachelor's degrees, HNDs, and professional programs offered
            by state universities and higher institutes. Search by subject,
            career interest, or institution.
          </p>
        </div>

        {/* Search & Filter Bar Card */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs mb-8 space-y-4">
          {/* Main Search Input */}
          <div className="relative w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by program name, career (e.g. Biochemist), or keyword..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* University Dropdown */}
            <div className="relative">
              <select
                value={selectedUniversity}
                onChange={(e) => {
                  setSelectedUniversity(e.target.value);
                  setSelectedFaculty("All Faculties");
                  setCurrentPage(1);
                }}
                aria-label="Filter by University"
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-xl pl-3.5 pr-8 py-2.5 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {universities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Faculty Dropdown */}
            <div className="relative">
              <select
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by Faculty"
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-xl pl-3.5 pr-8 py-2.5 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {faculties.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Concours Dropdown */}
            <div className="relative">
              <select
                value={selectedConcours}
                onChange={(e) => {
                  setSelectedConcours(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by Entry Requirement"
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-xl pl-3.5 pr-8 py-2.5 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="All">All Entry Types</option>
                <option value="Concours Required">
                  Entrance Exam Required
                </option>
                <option value="Direct Entry">Direct Entry (No Concours)</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Category Tag Pills */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto hide-scrollbar">
            <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Filter size={12} /> Tags:
            </span>
            {CATEGORY_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedCategory(tag);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  selectedCategory === tag
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 px-1">
          <div className="text-sm font-medium text-slate-600">
            Showing{" "}
            <strong className="text-slate-900">
              {filteredPrograms.length}
            </strong>{" "}
            academic programs
          </div>
          {(searchQuery ||
            selectedUniversity !== "All Universities" ||
            selectedFaculty !== "All Faculties" ||
            selectedConcours !== "All" ||
            selectedCategory !== "All") && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              <RefreshCw size={12} />
              Reset Filters
            </button>
          )}
        </div>

        {/* Program Cards Grid */}
        {loading || programsLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        ) : paginatedPrograms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {paginatedPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  isSaved={savedProgramIds.has(program.id)}
                  onSave={handleSaveProgram}
                  onRemove={handleRemoveSavedProgram}
                />
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs font-medium text-slate-600 px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <BookOpen className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No programs match your search
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Try clearing your search keyword or switching your
              university/faculty filters to see available programs.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Reset All Filters
            </button>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Programs;

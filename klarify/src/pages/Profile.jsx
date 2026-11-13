import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Bookmark,
  Loader2,
  GraduationCap,
  Briefcase,
  Laptop,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Compass,
  Edit3,
  Check,
  RotateCcw,
  BookOpen
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getSavedPrograms, removeSavedProgram } from "../services/api";
import {
  getSavedCourses,
  removeSavedCourse,
  getSavedInternships,
  removeSavedInternship,
  getUserPortfolio,
  saveUserPortfolio
} from "../services/savedItemsService";
import { SKILL_CATEGORIES, CAREER_ROLES } from "../data/skillsData";
import { evaluateSkillGaps } from "../services/skillGapEngine";
import Layout from "../components/Layout";
import ProgramCard from "../components/ProgramCard";
import SEOHead from "../components/SEOHead";

const Profile = () => {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Active Tab: "blueprint", "programs", "courses", "internships", "portfolio"
  const [activeTab, setActiveTab] = useState("blueprint");

  // Data states
  const [savedPrograms, setSavedPrograms] = useState([]);
  const [savedCourses, setSavedCourses] = useState([]);
  const [savedInternships, setSavedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Portfolio state
  const [portfolio, setPortfolio] = useState(() => getUserPortfolio(user?.id));

  // Edit Name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullNameInput, setFullNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Program category filter
  const [programFilter, setProgramFilter] = useState("all");

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/profile" } });
    }
  }, [user, authLoading, navigate]);

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        try {
          const [programsData] = await Promise.all([
            getSavedPrograms(user.id),
          ]);
          setSavedPrograms(programsData || []);
          setSavedCourses(getSavedCourses(user.id));
          setSavedInternships(getSavedInternships(user.id));
          
          const userPort = getUserPortfolio(user.id);
          setPortfolio(userPort);
          setFullNameInput(user.user_metadata?.full_name || "");
        } catch (error) {
          console.error("Failed to load profile data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  // Compute Skill Gap evaluations if skills exist in portfolio
  const skillEvaluations = useMemo(() => {
    if (!portfolio?.knownSkills || portfolio.knownSkills.length === 0) return [];
    try {
      return evaluateSkillGaps(portfolio.knownSkills, { workMode: "all" });
    } catch {
      return [];
    }
  }, [portfolio?.knownSkills]);

  // Top career match
  const topCareerMatch = skillEvaluations[0] || null;

  // Handlers for removing saved items
  const handleRemoveProgram = async (programId) => {
    if (!user) return;
    try {
      await removeSavedProgram(user.id, programId);
      setSavedPrograms((prev) => prev.filter((p) => p.id !== programId));
    } catch (error) {
      console.error("Failed to remove program:", error);
    }
  };

  const handleRemoveCourse = (courseId) => {
    const updated = removeSavedCourse(user?.id, courseId);
    setSavedCourses(updated);
  };

  const handleRemoveInternship = (internshipId) => {
    const updated = removeSavedInternship(user?.id, internshipId);
    setSavedInternships(updated);
  };

  // Toggle skill in portfolio
  const handleToggleSkill = (skillId) => {
    const existing = portfolio.knownSkills || [];
    const isPresent = existing.includes(skillId);
    const updatedSkills = isPresent
      ? existing.filter((id) => id !== skillId)
      : [...existing, skillId];

    const updatedPortfolio = {
      ...portfolio,
      knownSkills: updatedSkills,
    };
    setPortfolio(updatedPortfolio);
    saveUserPortfolio(user?.id, updatedPortfolio);
  };

  // Save Name update
  const handleSaveName = async () => {
    if (!fullNameInput.trim()) return;
    setSavingName(true);
    try {
      if (updateUserProfile) {
        await updateUserProfile({ full_name: fullNameInput.trim() });
      }
      setIsEditingName(false);
    } catch (err) {
      console.error("Failed to update name:", err);
    } finally {
      setSavingName(false);
    }
  };

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    if (programFilter === "all") return savedPrograms;
    if (programFilter === "concours") {
      return savedPrograms.filter(
        (p) => p.is_concours || p.type?.toLowerCase().includes("concours") || p.admission_type === "concours"
      );
    }
    if (programFilter === "public") {
      return savedPrograms.filter((p) => {
        const uni = (p.university || "").toLowerCase();
        return uni.includes("yaounde") || uni.includes("buea") || uni.includes("douala") || uni.includes("bamenda") || uni.includes("dschang") || uni.includes("maroua");
      });
    }
    if (programFilter === "private") {
      return savedPrograms.filter((p) => {
        const uni = (p.university || "").toLowerCase();
        return !uni.includes("yaounde") && !uni.includes("buea") && !uni.includes("douala") && !uni.includes("bamenda") && !uni.includes("dschang") && !uni.includes("maroua");
      });
    }
    return savedPrograms;
  }, [savedPrograms, programFilter]);

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="animate-spin text-primary-500 dark:text-secondary-400" size={32} />
        </div>
      </Layout>
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    user.phone ||
    "Klarify Scholar";

  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <Layout>
      <SEOHead
        title="My Orientation & Career Hub | Klarify"
        description="Manage your multi-track academic orientation, saved university degrees, verified bootcamps, and career skill roadmaps."
      />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        {/* ── Top Header Card (Identity + Multi-Track Summary) ── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            {/* User Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-primary-500 dark:bg-secondary-500 text-white dark:text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={displayName}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={fullNameInput}
                        onChange={(e) => setFullNameInput(e.target.value)}
                        className="px-3 py-1 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="Enter full name"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={savingName}
                        className="p-1.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors cursor-pointer"
                      >
                        {savingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {displayName}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Edit display name"
                      >
                        <Edit3 size={14} />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {user.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} className="text-slate-400" />
                      {user.email}
                    </span>
                  )}
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400" />
                      {user.phone}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 font-bold text-[11px]">
                    <Sparkles size={11} /> Multi-Track Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action: Start New Exploration */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/flow")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-white dark:bg-secondary-500 dark:hover:bg-secondary-400 dark:text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                <Compass size={15} />
                <span>Explore Any Track</span>
              </button>
            </div>
          </div>

          {/* ── Multi-Track Strip (Allows exploring & guiding any stage) ── */}
          <div className="mt-6 pt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers size={13} className="text-primary-500" />
                Explore Tracks (Guide yourself, family, or candidates)
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                One account covers all pathways
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Track 1: Secondary School / GCE Leavers */}
              <div
                onClick={() => {
                  sessionStorage.setItem("flow_persona", "highschool");
                  navigate("/flow?step=2");
                }}
                className="p-4 rounded-2xl bg-[#E8EEAD]/40 dark:bg-slate-800/60 border border-[#E8EEAD] dark:border-slate-700 hover:border-primary-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-secondary-400">
                      Secondary & GCE
                    </span>
                    <GraduationCap size={14} className="text-slate-700 dark:text-secondary-400" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Undergraduate & Concours
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    Match GCE A-Levels with verified degree programs and entrance concours across Cameroon.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-slate-900 dark:text-secondary-400 group-hover:underline">
                  <span>Orient a Candidate</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Track 2: Bachelor's Graduates */}
              <div
                onClick={() => {
                  sessionStorage.setItem("flow_persona", "graduate");
                  navigate("/flow?step=2");
                }}
                className="p-4 rounded-2xl bg-[#E9EBF4]/50 dark:bg-slate-800/60 border border-[#E9EBF4] dark:border-slate-700 hover:border-primary-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary-500 dark:text-sky-400">
                      Graduates
                    </span>
                    <BookOpen size={14} className="text-primary-500 dark:text-sky-400" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Master&apos;s & Postgraduates
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    Explore specialized professional master&apos;s degrees, research cycles, and postgraduate concours.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-primary-600 dark:text-sky-300 group-hover:underline">
                  <span>Explore Master&apos;s</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Track 3: Job Seekers & Tech Learners */}
              <div
                onClick={() => {
                  sessionStorage.setItem("flow_persona", "professional");
                  navigate("/flow?step=2");
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Career Builders
                    </span>
                    <Laptop size={14} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Skills, Bootcamps & Jobs
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                    Map missing skill gaps. Get matched with local hubs, certified bootcamps, and internships.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                  <span>Bridge Skill Gaps</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Tab Navigation Bar ── */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("blueprint")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
              activeTab === "blueprint"
                ? "text-primary-500 dark:text-secondary-400 border-b-2 border-primary-500 dark:border-secondary-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            My Roadmaps & Blueprint
          </button>

          <button
            onClick={() => setActiveTab("programs")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
              activeTab === "programs"
                ? "text-primary-500 dark:text-secondary-400 border-b-2 border-primary-500 dark:border-secondary-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            Saved University Programs ({savedPrograms.length})
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
              activeTab === "courses"
                ? "text-primary-500 dark:text-secondary-400 border-b-2 border-primary-500 dark:border-secondary-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            Saved Bootcamps & Courses ({savedCourses.length})
          </button>

          <button
            onClick={() => setActiveTab("internships")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
              activeTab === "internships"
                ? "text-primary-500 dark:text-secondary-400 border-b-2 border-primary-500 dark:border-secondary-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            Saved Internships ({savedInternships.length})
          </button>

          <button
            onClick={() => setActiveTab("portfolio")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
              activeTab === "portfolio"
                ? "text-primary-500 dark:text-secondary-400 border-b-2 border-primary-500 dark:border-secondary-400"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            Skills & Profile Settings
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── TAB 1: MY ROADMAPS & BLUEPRINT ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "blueprint" && (
          <div className="space-y-8">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400">Programs Saved</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {savedPrograms.length}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Universities & Concours</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400">Bootcamps & Courses</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {savedCourses.length}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Online & In-Person Hubs</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400">Saved Internships</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {savedInternships.length}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Remote & Cameroon Cohorts</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400">Skills Tracked</span>
                <div className="text-2xl font-black text-primary-500 dark:text-secondary-400 mt-1">
                  {portfolio?.knownSkills?.length || 0}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Verified in Portfolio</span>
              </div>
            </div>

            {/* Active Skill Gap Trajectory Card */}
            {topCareerMatch ? (
              <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-300">
                        Top Career Trajectory Match
                      </span>
                      <span className="text-xs text-slate-400">{topCareerMatch.role.domain}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {topCareerMatch.role.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {topCareerMatch.role.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center md:flex-col items-end gap-2">
                    <div className="text-3xl font-black text-primary-500 dark:text-secondary-400">
                      {topCareerMatch.matchScore}%
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Skill Compatibility
                    </span>
                  </div>
                </div>

                {/* Skills Acquired vs Missing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Skills In Your Profile ({topCareerMatch.acquiredSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {topCareerMatch.acquiredSkills.map((s) => (
                        <span
                          key={s.id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/80 dark:border-emerald-800/40"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                      <AlertCircle size={14} className="text-amber-500" />
                      Gap Skills to Bridge ({topCareerMatch.missingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {topCareerMatch.missingSkills.length > 0 ? (
                        topCareerMatch.missingSkills.map((s) => (
                          <span
                            key={s.id}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-200/80 dark:border-amber-800/40"
                          >
                            + {s.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold">
                          🎉 100% matched! Ready for immediate junior contracts.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Local salary range: {topCareerMatch.role.salaryRange}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate("/skill-results", { state: { skills: portfolio.knownSkills } })}
                      className="text-xs font-bold text-primary-500 dark:text-secondary-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Full Career Gap Report</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
                <Laptop size={36} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No Career Assessment on File Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                  Input your skills to evaluate market fit against top Cameroon and remote tech roles, or run an academic degree orientation.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                  <button
                    onClick={() => {
                      sessionStorage.setItem("flow_persona", "professional");
                      navigate("/flow?step=2");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Run Skill Gap Evaluation
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.setItem("flow_persona", "highschool");
                      navigate("/flow?step=2");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Run High School Orientation
                  </button>
                </div>
              </div>
            )}

            {/* Official Concours & GCE Notice Board */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#E9EBF4]/40 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Building size={16} className="text-primary-500" />
                  National Orientation & Exam Notice Board (Cameroon)
                </h3>
                <Link
                  to="/gce-results"
                  className="text-xs font-bold text-primary-500 hover:underline"
                >
                  Verify GCE Results
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-primary-500 uppercase">Undergraduate Concours</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                    FMSB, ENSP, ENS & Polytechs
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Annual entrance exams for public Grandes Écoles. Check syllabus and past papers.
                  </p>
                  <Link
                    to="/flow?persona=highschool"
                    className="mt-3 text-[11px] font-bold text-primary-500 block hover:underline"
                  >
                    Explore Concours Tracks &rarr;
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-secondary-600 dark:text-secondary-400 uppercase">Official Results</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                    GCE Ordinary & Advanced Level
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Verify candidate slips, subject combinations, and grade points directly on Klarify.
                  </p>
                  <Link
                    to="/gce-results"
                    className="mt-3 text-[11px] font-bold text-secondary-600 dark:text-secondary-400 block hover:underline"
                  >
                    Search Candidate &rarr;
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">Vocational & Tech</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                    Partner Tech Cohorts
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Accredited coding bootcamps, vocational centers, and internship placements.
                  </p>
                  <Link
                    to="/flow?persona=professional"
                    className="mt-3 text-[11px] font-bold text-purple-600 block hover:underline"
                  >
                    View Tech Cohorts &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── TAB 2: SAVED UNIVERSITY PROGRAMS & CONCOURS ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "programs" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Saved University Programs & Concours ({savedPrograms.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Programs you have bookmarked across public and private Cameroon institutions.
                </p>
              </div>

              {/* Sub-Filters */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
                {["all", "public", "private", "concours"].map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setProgramFilter(filterKey)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                      programFilter === filterKey
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {filterKey}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <Loader2 className="animate-spin text-primary-500" size={24} />
              </div>
            ) : filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPrograms.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    isSaved={true}
                    onRemove={handleRemoveProgram}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs">
                <Bookmark size={36} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {programFilter === "all" ? "No saved programs yet" : `No saved ${programFilter} programs`}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                  Bookmark programs from your orientation results or the university catalog to easily compare options.
                </p>
                <button
                  onClick={() => navigate("/programs")}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-colors cursor-pointer"
                >
                  Browse Academic Catalog
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── TAB 3: SAVED BOOTCAMPS & COURSES ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "courses" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Saved Bootcamps & Courses ({savedCourses.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Targeted courses and training programs saved from your Skill Gap assessments.
                </p>
              </div>

              <button
                onClick={() => {
                  sessionStorage.setItem("flow_persona", "professional");
                  navigate("/flow?step=2");
                }}
                className="text-xs font-bold text-primary-500 dark:text-secondary-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Find More Courses</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {savedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCourses.map((course, i) => (
                  <div
                    key={course.id || i}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary-500">
                          {course.provider || "Online"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">{course.duration}</span>
                          <button
                            onClick={() => handleRemoveCourse(course.id || course.title)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                            title="Remove from saved"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-secondary-400 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-600">{course.cost || "Free audit"}</span>
                      {course.url && (
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-500 dark:text-secondary-400 font-bold hover:underline"
                        >
                          Start Learning <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs">
                <Laptop size={36} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  No courses or bootcamps saved
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                  Evaluate your existing skills in the Skill Gap assessment to discover and bookmark matching bootcamps, courses, and certifications.
                </p>
                <button
                  onClick={() => {
                    sessionStorage.setItem("flow_persona", "professional");
                    navigate("/flow?step=2");
                  }}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-colors cursor-pointer"
                >
                  Explore Skill Bridge
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── TAB 4: SAVED INTERNSHIPS & OPPORTUNITIES ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "internships" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Saved Internships & Opportunities ({savedInternships.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Remote and local Cameroon tech internships, junior cohorts, and fellowships.
                </p>
              </div>
            </div>

            {savedInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedInternships.map((item, i) => (
                  <div
                    key={item.id || i}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/70 dark:border-emerald-800/40 hover:border-emerald-500 transition-all flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                          {item.provider}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            {item.deliveryMode === "remote" ? "Remote" : "Onsite Cameroon"}
                          </span>
                          <button
                            onClick={() => handleRemoveInternship(item.id || item.title)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                            title="Remove from saved"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-emerald-600">{item.cost}</span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-500 dark:text-secondary-400 font-bold hover:underline"
                        >
                          Inquire / Apply <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs">
                <Briefcase size={36} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  No saved internships yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                  When you review career gap trajectories, bookmark partner tech hubs and junior internship openings to track them here.
                </p>
                <button
                  onClick={() => {
                    sessionStorage.setItem("flow_persona", "professional");
                    navigate("/flow?step=2");
                  }}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-colors cursor-pointer"
                >
                  Explore Opportunities
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── TAB 5: SKILLS & PROFILE SETTINGS ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "portfolio" && (
          <div className="space-y-8">
            {/* Skills Inventory Manager */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Skills Portfolio ({portfolio.knownSkills?.length || 0} active)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select the skills you possess. Klarify will automatically use them to personalize your recommendations.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sessionStorage.setItem("flow_persona", "professional");
                    navigate("/flow?step=2");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-500 dark:text-secondary-400 hover:underline cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Recalculate Fit</span>
                </button>
              </div>

              {/* Skills by Category */}
              <div className="mt-6 space-y-6">
                {Object.entries(SKILL_CATEGORIES).map(([catName, skillsList]) => (
                  <div key={catName}>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                      {catName}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill) => {
                        const isSelected = portfolio.knownSkills?.includes(skill.id);
                        return (
                          <button
                            key={skill.id}
                            onClick={() => handleToggleSkill(skill.id)}
                            type="button"
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-primary-500 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {isSelected ? <Check size={12} className="stroke-[3]" /> : <Plus size={12} />}
                            <span>{skill.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Level & Goal Settings */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                Education Level & Orientation Preferences
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Tell us where you are currently positioned to receive the most relevant Cameroon academic alerts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "secondary", title: "Secondary School / GCE", desc: "A-Level candidate or graduate" },
                  { id: "undergraduate", title: "Undergraduate Student", desc: "Currently in university / BTS" },
                  { id: "graduate", title: "Bachelor's Graduate", desc: "Looking for Master's or jobs" },
                  { id: "professional", title: "Working / Self-Taught", desc: "Acquiring in-demand tech skills" },
                ].map((level) => {
                  const isCurrent = portfolio.academicLevel === level.id;
                  return (
                    <div
                      key={level.id}
                      onClick={() => {
                        const updated = { ...portfolio, academicLevel: level.id };
                        setPortfolio(updated);
                        saveUserPortfolio(user?.id, updated);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? "border-primary-500 bg-primary-50/40 dark:bg-primary-950/20 text-slate-900 dark:text-white shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{level.title}</span>
                        {isCurrent && <CheckCircle2 size={14} className="text-primary-500 shrink-0" />}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-snug">
                        {level.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;

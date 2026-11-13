import React, { useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Laptop,
  GraduationCap,
  Building,
  ArrowRight,
  RotateCcw,
  Globe,
  MapPin,
  TrendingUp,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Filter,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { evaluateSkillGaps } from "../services/skillGapEngine";
import { useAuth } from "../context/AuthContext";
import {
  getSavedCourses,
  saveCourse,
  removeSavedCourse,
  getSavedInternships,
  saveInternship,
  removeSavedInternship,
} from "../services/savedItemsService";

const SkillResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state || {};

  // State from navigation or sessionStorage
  const userSkills = useMemo(() => {
    try {
      return (
        stateData.skills ||
        JSON.parse(sessionStorage.getItem("flow_user_skills") || "[]")
      );
    } catch {
      return [];
    }
  }, [location.skills]);

  const rawPreferences = useMemo(() => {
    try {
      return (
        stateData.preferences ||
        JSON.parse(sessionStorage.getItem("flow_user_preferences") || "{}")
      );
    } catch {
      return { workMode: "all" };
    }
  }, [location.preferences]);

  const { user } = useAuth();
  const [savedCoursesList, setSavedCoursesList] = useState(() => getSavedCourses(user?.id));
  const [savedInternshipsList, setSavedInternshipsList] = useState(() => getSavedInternships(user?.id));

  const handleToggleCourse = (course) => {
    const id = course.id || course.title;
    const isSaved = savedCoursesList.some((c) => (c.id || c.title) === id);
    if (isSaved) {
      const updated = removeSavedCourse(user?.id, id);
      setSavedCoursesList(updated);
    } else {
      const updated = saveCourse(user?.id, course);
      setSavedCoursesList(updated);
    }
  };

  const handleToggleInternship = (internship) => {
    const id = internship.id || internship.title;
    const isSaved = savedInternshipsList.some((i) => (i.id || i.title) === id);
    if (isSaved) {
      const updated = removeSavedInternship(user?.id, id);
      setSavedInternshipsList(updated);
    } else {
      const updated = saveInternship(user?.id, internship);
      setSavedInternshipsList(updated);
    }
  };

  const [activeWorkModeFilter, setActiveWorkModeFilter] = useState(
    rawPreferences.workMode || "all"
  );
  const [expandedRoleId, setExpandedRoleId] = useState(null);

  // Compute matches
  const careerEvaluations = useMemo(() => {
    return evaluateSkillGaps(userSkills, {
      ...rawPreferences,
      workMode: activeWorkModeFilter,
    });
  }, [userSkills, rawPreferences, activeWorkModeFilter]);

  const toggleExpand = (roleId) => {
    setExpandedRoleId(expandedRoleId === roleId ? null : roleId);
  };

  return (
    <Layout>
      <SEOHead
        title="Career Trajectory & Skill Gap Assessment | Klarify"
        description="Personalized career roadmap showing your skill matches, gaps, and targeted courses, bootcamps, and internships in Cameroon and remote."
      />

      <div className="max-w-7xl mx-auto py-8">
        {/* Top Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-secondary-950/40 border border-primary-100 dark:border-secondary-800 text-primary-700 dark:text-secondary-400 text-xs font-bold mb-3">
              <TrendingUp size={14} />
              Skill Gap & Career Bridge Blueprint
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recommended Career Pathways
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
              We evaluated your {userSkills.length} selected skill{userSkills.length !== 1 ? "s" : ""} against current market demands. Here are the fastest paths to high-paying remote and onsite roles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/flow?step=1"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={14} />
              Retake Assessment
            </a>
          </div>
        </div>

        {/* Filter Bar: Remote vs Onsite */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Filter size={14} className="text-primary-500 dark:text-secondary-400" />
            <span>Filter Opportunities:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Pathways (Remote & Onsite)" },
              { id: "remote", label: "🌐 Remote Only (USD / EUR)" },
              { id: "onsite", label: "🏢 Onsite Cameroon" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveWorkModeFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeWorkModeFilter === f.id
                    ? "bg-primary-500 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trajectory Cards List */}
        <div className="space-y-6">
          {careerEvaluations.map((item, idx) => {
            const {
              role,
              matchScore,
              acquiredSkills,
              missingSkills,
              fulfillment,
              totalResourcesFound,
            } = item;

            const isExpanded = expandedRoleId === role.id || idx === 0;

            return (
              <div
                key={role.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Main Card Header */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {role.domain}
                      </span>

                      {role.workModes.includes("remote") && (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800/40">
                          <Globe size={12} />
                          Remote Friendly
                        </span>
                      )}

                      {role.workModes.includes("onsite") && (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center gap-1 border border-blue-200/60 dark:border-blue-800/40">
                          <MapPin size={12} />
                          Onsite Cameroon
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {role.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed max-w-3xl">
                      {role.description}
                    </p>

                    {/* Salary and Demand Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <DollarSign size={15} className="text-primary-500 shrink-0" />
                        <span>
                          <strong className="text-slate-900 dark:text-white">Earnings: </strong>
                          {role.salaryRange}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <TrendingUp size={15} className="text-secondary-500 shrink-0" />
                        <span>
                          <strong className="text-slate-900 dark:text-white">Local Demand: </strong>
                          {role.localDemand}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="lg:w-48 shrink-0 flex flex-col items-center lg:items-end justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <div className="text-3xl font-black tracking-tight text-primary-500 dark:text-secondary-400">
                      {matchScore}%
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                      Current Match
                    </span>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-primary-500 dark:bg-secondary-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${matchScore}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-center">
                      {missingSkills.length === 0
                        ? "Ready to apply!"
                        : `${missingSkills.length} skill${missingSkills.length > 1 ? "s" : ""} away`}
                    </span>
                  </div>
                </div>

                {/* The Skill Bridge (Have vs Gap) */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skills You Have */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                      <CheckCircle2 size={15} className="text-emerald-500" />
                      Skills You Already Possess ({acquiredSkills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {acquiredSkills.length > 0 ? (
                        acquiredSkills.map((s) => (
                          <span
                            key={s.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/80 dark:border-emerald-800/40 flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={12} />
                            {s.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          No baseline skills matched yet.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Skills You Need (The Delta / Gap) */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                      <AlertCircle size={15} className="text-amber-500" />
                      Skills You Need to Bridge ({missingSkills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {missingSkills.length > 0 ? (
                        missingSkills.map((s) => (
                          <span
                            key={s.id}
                            className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-200/80 dark:border-amber-800/40 flex items-center gap-1.5 shadow-xs"
                          >
                            <span>+ {s.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-normal">
                              {s.minLevel}
                            </span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold">
                          🎉 You meet 100% of required skills for this role!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fulfillment Accordion Toggle */}
                {missingSkills.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(role.id)}
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-primary-500 dark:text-secondary-400 hover:underline cursor-pointer"
                    >
                      <span>
                        {isExpanded
                          ? "Hide Learning & Internship Opportunities"
                          : `View Recommended Courses, Bootcamps & Internships (${totalResourcesFound})`}
                      </span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                )}

                {/* Expanded Fulfillment Hub (Courses, Bootcamps, Internships, Books) */}
                {isExpanded && (
                  <div className="mt-6 space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 rounded-b-3xl">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Targeted Learning & Opportunity Plan
                    </div>

                    {/* Courses */}
                    {fulfillment.courses.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                          <Laptop size={14} className="text-blue-500" />
                          Recommended Online Courses (Coursera / Verified)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {fulfillment.courses.map((res, i) => {
                            const isSaved = savedCoursesList.some((c) => (c.id || c.title) === (res.id || res.title));
                            return (
                              <div
                                key={i}
                                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-secondary-500 transition-all flex flex-col justify-between group"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-primary-500 uppercase">
                                      {res.provider}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-slate-400">{res.duration}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleCourse(res);
                                        }}
                                        type="button"
                                        title={isSaved ? "Remove from Saved" : "Save to Profile"}
                                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors"
                                      >
                                        {isSaved ? (
                                          <BookmarkCheck size={14} className="text-primary-500 dark:text-secondary-400 fill-current" />
                                        ) : (
                                          <Bookmark size={14} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-secondary-400 transition-colors">
                                    {res.title}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                    {res.description}
                                  </p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                  <span className="font-semibold text-emerald-600">{res.cost}</span>
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary-500 font-bold hover:underline"
                                  >
                                    Start Learning <ExternalLink size={12} />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Bootcamps & Vocational Training */}
                    {fulfillment.bootcamps.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                          <Building size={14} className="text-purple-500" />
                          Bootcamps & In-Person Hubs (Cameroon & Africa)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {fulfillment.bootcamps.map((res, i) => {
                            const isSaved = savedCoursesList.some((c) => (c.id || c.title) === (res.id || res.title));
                            return (
                              <div
                                key={i}
                                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-purple-600 uppercase">
                                      {res.provider}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {res.city || res.deliveryMode}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleCourse(res);
                                        }}
                                        type="button"
                                        title={isSaved ? "Remove from Saved" : "Save to Profile"}
                                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-purple-600 transition-colors"
                                      >
                                        {isSaved ? (
                                          <BookmarkCheck size={14} className="text-primary-500 dark:text-secondary-400 fill-current" />
                                        ) : (
                                          <Bookmark size={14} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                                    {res.title}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                    {res.description}
                                  </p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                  <span className="text-slate-600 dark:text-slate-300 font-semibold">{res.duration}</span>
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-500 dark:text-secondary-400 font-bold hover:underline inline-flex items-center gap-1"
                                  >
                                    Inquire Admission <ExternalLink size={12} />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Internships & Fellowships */}
                    {fulfillment.internships.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                          <Briefcase size={14} className="text-emerald-500" />
                          Partner Internships & Junior Roles
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {fulfillment.internships.map((res, i) => {
                            const isSaved = savedInternshipsList.some((item) => (item.id || item.title) === (res.id || res.title));
                            return (
                              <div
                                key={i}
                                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/40 flex flex-col justify-between shadow-xs"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">
                                      {res.provider}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                        {res.deliveryMode === "remote" ? "Remote Internship" : "Onsite Internship"}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleInternship(res);
                                        }}
                                        type="button"
                                        title={isSaved ? "Remove from Saved" : "Save to Profile"}
                                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600 transition-colors"
                                      >
                                        {isSaved ? (
                                          <BookmarkCheck size={14} className="text-emerald-600 fill-current" />
                                        ) : (
                                          <Bookmark size={14} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                                    {res.title}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                    {res.description}
                                  </p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                  <span className="font-extrabold text-emerald-600">{res.cost}</span>
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-500 dark:text-secondary-400 font-bold hover:underline inline-flex items-center gap-1"
                                  >
                                    Apply via Partner <ArrowRight size={12} />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Real Cameroon University Degree Programs & Concours */}
                    {fulfillment.degreePrograms && fulfillment.degreePrograms.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                          <GraduationCap size={14} className="text-primary-500 dark:text-secondary-400" />
                          Accredited Cameroon University Degrees & Concours
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {fulfillment.degreePrograms.map((prog, i) => (
                            <Link
                              key={i}
                              to={prog.url}
                              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-secondary-500 transition-all flex flex-col justify-between group shadow-xs"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-[10px] font-bold text-primary-500 uppercase">
                                    {prog.university}
                                  </span>
                                  {prog.requiresConcour && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-800 dark:text-secondary-300">
                                      Entrance Concours
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-secondary-400 transition-colors">
                                  {prog.title}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                  {prog.faculty} - {prog.duration}
                                </p>
                              </div>
                              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-slate-500 dark:text-slate-400">Accredited Program</span>
                                <span className="inline-flex items-center gap-1 text-primary-500 dark:text-secondary-400 font-bold group-hover:translate-x-0.5 transition-transform">
                                  View Requirements <ArrowRight size={12} />
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Books */}
                    {fulfillment.books.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                          <BookOpen size={14} className="text-amber-500" />
                          Essential Reading & Foundation Guides
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {fulfillment.books.map((res, i) => (
                            <a
                              key={i}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:border-slate-300"
                            >
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">{res.title}</div>
                                <div className="text-[11px] text-slate-500">{res.provider}</div>
                              </div>
                              <ExternalLink size={14} className="text-slate-400 shrink-0 ml-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default SkillResults;

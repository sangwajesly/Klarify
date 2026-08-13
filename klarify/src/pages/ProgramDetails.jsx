import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Clock,
  Award,
  ExternalLink,
  Briefcase,
  Bookmark,
  BookOpen,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import ProgramCard from "../components/ProgramCard";
import { useAuth } from "../context/AuthContext";
import { fetchProgramById, fetchAllPrograms, getSavedPrograms, saveProgram, removeSavedProgram } from "../services/api";

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [program, setProgram] = useState(null);
  const [relatedPrograms, setRelatedPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProgramData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProgramById(id);
        setProgram(data);

        // Fetch related programs (same university or faculty)
        const all = await fetchAllPrograms();
        const related = all
          .filter((p) => p.id !== id && (p.university === data.university || p.faculty === data.faculty))
          .slice(0, 3);
        setRelatedPrograms(related);

        if (user) {
          const saved = await getSavedPrograms(user.id);
          setIsSaved(saved.some((s) => s.id === id));
        }
      } catch (err) {
        console.error("Failed to fetch program:", err);
        setError("Program not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    loadProgramData();
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/programs/${id}` } });
      return;
    }
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await removeSavedProgram(user.id, id);
        setIsSaved(false);
      } else {
        await saveProgram(user.id, id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-28">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      </Layout>
    );
  }

  if (error || !program) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Program Not Found</h1>
          <p className="text-slate-500 mb-6">{error || "The program you are looking for does not exist."}</p>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-xl transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Programs Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  const programSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": program.name,
    "description": program.descriptions || `${program.name} offered by ${program.university}`,
    "provider": {
      "@type": "CollegeOrUniversity",
      "name": program.university
    }
  };

  return (
    <Layout>
      <SEOHead
        title={`${program.name} - ${program.university} | KlarifyPath`}
        description={program.descriptions || `Explore prerequisites, degree duration, concours requirements, and career paths for ${program.name} at ${program.university}.`}
        canonicalUrl={`https://www.klarifypath.com/programs/${id}`}
        structuredData={programSchema}
      />

      <main className="py-6 pb-20">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Hero Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-9 shadow-lg border border-slate-800 relative overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div className="space-y-3 flex-1">
              {/* University pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-orange-300 text-xs font-semibold">
                <Building2 size={14} />
                {program.university}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {program.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
                {program.faculty && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={16} className="text-orange-400" />
                    <span>{program.faculty}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-orange-400" />
                  <span>{program.duration}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <button
                onClick={handleToggleSave}
                disabled={isSaving}
                className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${
                  isSaved
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>

              {program.portalUrl && (
                <a
                  href={program.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-orange-500/25"
                >
                  Visit Official Portal
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left / Main Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BookOpen size={20} className="text-orange-500" />
                Program Overview
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {program.descriptions || `The ${program.name} degree offered by ${program.university} (${program.faculty || "Faculty"}) is designed to equip students with theoretical knowledge and practical skills for professional excellence.`}
              </p>

              {/* Tags */}
              {program.tags && program.tags.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-2">
                  {program.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Entrance Exam / Concours Section if required */}
            {program.requiresConcours && program.examDetails && (
              <section className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-cyan-50/60 to-white p-6 sm:p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Award size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">National Entrance Exam Required</h2>
                    <p className="text-xs font-semibold text-blue-600">{program.examDetails.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/80 rounded-xl p-3 border border-blue-100 text-center">
                    <span className="block text-[10px] uppercase font-bold text-blue-600/80 mb-0.5">Exam Month</span>
                    <span className="block text-sm font-bold text-slate-900">{program.examDetails.month || "June / July"}</span>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3 border border-blue-100 text-center">
                    <span className="block text-[10px] uppercase font-bold text-blue-600/80 mb-0.5">Deadline</span>
                    <span className="block text-sm font-bold text-slate-900">{program.examDetails.deadline || "Varies"}</span>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3 border border-blue-100 text-center">
                    <span className="block text-[10px] uppercase font-bold text-blue-600/80 mb-0.5">Exam Fee</span>
                    <span className="block text-sm font-bold text-slate-900">{program.examDetails.fee || "20,000 XAF"}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/exam-details", { state: { examDetails: program.examDetails } })}
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    <ExternalLink size={14} />
                    View Full Exam Guidelines & Documents
                  </button>

                  <a
                    href={`https://wa.me/237672507711?text=${encodeURIComponent(`Hello Sir, I need past questions for ${program.name} (${program.examDetails.name})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    Get Past Questions on WhatsApp
                  </a>
                </div>
              </section>
            )}

            {/* Potential Careers */}
            <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-orange-500" />
                Target Careers & Job Roles
              </h2>
              {program.careers && program.careers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {program.careers.map((career, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                      <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No specific career roles mapped yet.</p>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Prerequisites Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                Admission Prerequisites
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div>
                  <span className="block font-semibold text-slate-800 mb-1">Required A-Level Subjects:</span>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/60 font-medium text-slate-700">
                    {program.requiredALSubjects || "GCE A-Level Passes in relevant Arts or Science subjects."}
                  </div>
                </div>

                <div>
                  <span className="block font-semibold text-slate-800 mb-1">Duration:</span>
                  <p className="text-slate-700 font-bold">{program.duration}</p>
                </div>

                <div>
                  <span className="block font-semibold text-slate-800 mb-1">Entry Mode:</span>
                  <p className="text-slate-700 font-bold">
                    {program.requiresConcours ? "Competitive Entrance Exam (Concours)" : "Direct Academic Entry"}
                  </p>
                </div>
              </div>
            </div>

            {/* University Link Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs text-center">
              <Building2 className="mx-auto text-orange-500 mb-2" size={32} />
              <h4 className="font-bold text-slate-900 text-sm mb-1">{program.university}</h4>
              <p className="text-xs text-slate-500 mb-4">{program.faculty}</p>
              <Link
                to={`/universities`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                View All Programs at this University ➔
              </Link>
            </div>
          </div>
        </div>

        {/* Related Programs Section */}
        {relatedPrograms.length > 0 && (
          <section className="pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Related Programs You Might Like</h2>
            <div className="grid grid-cols-1 gap-4">
              {relatedPrograms.map((rel) => (
                <ProgramCard key={rel.id} program={rel} />
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
};

export default ProgramDetails;

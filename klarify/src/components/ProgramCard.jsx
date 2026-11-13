import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Bookmark,
  MessageCircle,
} from "lucide-react";

const ProgramCard = ({ program, isSaved, onSave, onRemove }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isPaidTier = !program.institution_id || program.subscription_tier === "PRO" || program.subscription_tier === "FEATURED";

  const handleToggleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (isSaved && onRemove) {
        await onRemove(program.id);
      } else if (!isSaved && onSave) {
        await onSave(program.id);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card overflow-hidden group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1 pr-4">
          <div className="flex items-start justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-secondary-400 transition-colors">
              {program.name}
            </h3>
            {(onSave || onRemove) && (
              <button
                onClick={handleToggleSave}
                disabled={isSaving}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ml-4 ${
                  isSaved
                    ? "bg-secondary-100 dark:bg-secondary-950/50 text-secondary-900 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-900/60"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:text-slate-400"
                } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                aria-label={isSaved ? "Remove from saved" : "Save program"}
              >
                <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
              </button>
            )}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <div className="inline-flex items-center gap-1.5 flex-wrap">
              <Building2 size={15} className="text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{program.university}</span>
              {isPaidTier && program.institution_id && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/50 uppercase tracking-wider select-none">
                  Verified Partner
                </span>
              )}
            </div>
            {program.faculty && (
              <div className="inline-flex items-center gap-1.5">
                <GraduationCap size={15} className="text-slate-400" />
                <span>{program.faculty}</span>
              </div>
            )}
            {program.degreeObtained && (
              <div className="inline-flex items-center gap-1.5">
                <Award size={15} className="text-slate-400" />
                <span>{program.degreeObtained}</span>
              </div>
            )}
            <div className="inline-flex items-center gap-1.5">
              <Clock size={15} className="text-slate-400" />
              <span>{program.duration}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2.5 shrink-0 w-full md:w-auto mt-4 md:mt-0">
          {program.requiresConcours && (
            <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-amber-200/60 dark:border-amber-900/50 w-full md:w-auto justify-center">
              <Award size={14} />
              <span>Entrance Exam Required</span>
            </div>
          )}
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
            {program.portalUrl && (
              <a
                href={program.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all w-full md:w-auto justify-center shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Apply / Visit Portal</span>
                <ExternalLink size={14} />
              </a>
            )}
            {isPaidTier && program.whatsapp_number && (
              <a
                href={`https://wa.me/${String(program.whatsapp_number).replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hello Admissions Office, I found your "${program.name}" program on Klarify and would like to inquire about current registration procedures.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all w-full md:w-auto justify-center shadow-xs hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
              >
                <MessageCircle size={14} />
                <span>Chat Admissions</span>
              </a>
            )}
          </div>
          {program.tuition_fee_xaf && (
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200/70 dark:border-slate-800 w-full md:w-auto text-center">
              {isPaidTier ? (
                <span>
                  {typeof program.tuition_fee_xaf === "number"
                    ? program.tuition_fee_xaf.toLocaleString() + " XAF"
                    : program.tuition_fee_xaf + " XAF"}
                </span>
              ) : (
                <span className="text-slate-400 italic font-normal text-xs">
                  Fees: Contact Registrar
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white transition-colors w-full cursor-pointer"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>{expanded ? "Hide Details & Careers" : "Explore Details & Careers"}</span>
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Entrance Exam Details : Soft Clean Callout */}
            {program.requiresConcours && program.examDetails && (
              <div className="rounded-[1.75rem] border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-300">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Entrance Exam Required
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {program.examDetails.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-white dark:bg-slate-800/90 rounded-2xl px-4 py-3 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold mb-1">
                      Exam Month
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {program.examDetails.month}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/90 rounded-2xl px-4 py-3 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold mb-1">
                      Deadline
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {isPaidTier ? program.examDetails.deadline : "Locked (Upgrade)"}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/90 rounded-2xl px-4 py-3 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-400 font-bold mb-1">
                      Exam Fee
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {isPaidTier ? program.examDetails.fee : "Locked (Upgrade)"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/exam-details", {
                        state: { examDetails: program.examDetails },
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    <span>More Exam Details</span>
                  </button>

                  <a
                    href={`https://wa.me/237672507711?text=${encodeURIComponent(`Greetings Sir, i need past questions for ${program.name} (${program.examDetails.name})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
                  >
                    <ExternalLink size={14} />
                    <span>View Past Questions</span>
                  </a>
                </div>
              </div>
            )}

            {/* Career Paths Section */}
            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/80 rounded-[1.75rem] border border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                <Briefcase size={16} className="text-primary-500 dark:text-secondary-400" />
                <span>Potential Career Paths</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {program.careers && program.careers.length > 0 ? (
                  program.careers.map((career, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-full transition-all shadow-2xs"
                    >
                      {career}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                    No specific careers listed
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;
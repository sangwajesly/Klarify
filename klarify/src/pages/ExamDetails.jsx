import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  FileText,
  BadgeDollarSign,
  GraduationCap,
} from "lucide-react";

const Row = ({ label, value, icon }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-orange-600">{icon}</div>}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            {label}
          </div>
          <div className="text-sm font-bold text-slate-900 break-words">
            {Array.isArray(value) ? value.join(", ") : value}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExamDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { examDetails } = location.state || {};

  const handleBackToResults = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/results");
    }
  };

  if (!examDetails) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ArrowLeft size={16} />
            <button className="underline" onClick={handleBackToResults}>
              Back to results
            </button>
          </div>
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
            <AlertCircle className="text-orange-600" size={22} />
            <p className="mt-3 text-slate-700 font-medium">
              No exam details were provided.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-6">
          <ArrowLeft size={16} />
          <button
            className="hover:text-orange-700 transition-colors"
            onClick={handleBackToResults}
          >
            Back to results
          </button>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-orange-300 text-xs font-semibold">
              <AlertCircle size={14} />
              Entrance Exam
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold">
              {examDetails.name || "Exam Details"}
            </h1>

            {(examDetails.month || examDetails.deadline || examDetails.fee) && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <div className="bg-white/8 border border-white/10 rounded-xl px-4 py-3">
                  <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                    Exam Month
                  </div>
                  <div className="text-sm font-bold text-white">
                    {examDetails.month || "-"}
                  </div>
                </div>
                <div className="bg-white/8 border border-white/10 rounded-xl px-4 py-3">
                  <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                    Deadline
                  </div>
                  <div className="text-sm font-bold text-white">
                    {examDetails.deadline || "-"}
                  </div>
                </div>
                <div className="bg-white/8 border border-white/10 rounded-xl px-4 py-3">
                  <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                    Fee
                  </div>
                  <div className="text-sm font-bold text-white">
                    {examDetails.fee || "-"}
                  </div>
                </div>
              </div>
            )}

            {examDetails.summary && (
              <p className="mt-5 text-slate-200 leading-relaxed text-sm">
                {examDetails.summary}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Row
            label="Registration Date"
            value={examDetails.reg_date}
            icon={<CalendarDays size={18} />}
          />
          <Row
            label="Writing Date"
            value={examDetails.writing_date}
            icon={<GraduationCap size={18} />}
          />
          <Row
            label="Required Subjects"
            value={examDetails.required_subjects}
          />
          <Row
            label="Required Documents"
            value={examDetails.required_documents}
            icon={<FileText size={18} />}
          />
          <Row
            label="Exam Fee"
            value={examDetails.fee}
            icon={<BadgeDollarSign size={18} />}
          />
        </div>

        {examDetails.registration_procedure &&
          Array.isArray(examDetails.registration_procedure) &&
          examDetails.registration_procedure.length > 0 && (
            <div className="mt-6 bg-slate-50 rounded-xl border border-slate-100 p-6">
              <h2 className="text-base font-extrabold text-slate-900">
                Registration Procedure
              </h2>
              <ol className="mt-3 list-decimal list-inside text-slate-700 text-sm space-y-2">
                {examDetails.registration_procedure.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {examDetails.portalUrl && (
            <a
              href={examDetails.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-colors"
            >
              Visit Registration Portal
            </a>
          )}

          <a
            href={`https://wa.me/237672507711?text=${encodeURIComponent(`Greetings Sir, i need past questions for ${examDetails.name || "this exam"}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
          >
            View Past Questions
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default ExamDetails;

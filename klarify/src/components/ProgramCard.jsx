import React, { useState } from 'react';
import { Building2, Clock, AlertCircle, ChevronDown, ChevronUp, ExternalLink, GraduationCap, Briefcase } from 'lucide-react';

const ProgramCard = ({ program }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card overflow-hidden group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
            {program.name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Building2 size={16} className="text-slate-400" />
              {program.university}
            </div>
            {program.faculty && (
              <div className="flex items-center gap-1.5">
                <GraduationCap size={16} className="text-slate-400" />
                {program.faculty}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-slate-400" />
              {program.duration}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
          {program.requiresConcours && (
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-orange-100 w-full md:w-auto justify-center">
              <AlertCircle size={16} />
              Entrance Exam Required
            </div>
          )}
          {program.portalUrl && (
            <a 
              href={program.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors w-full md:w-auto justify-center shadow-sm"
            >
              Apply / Visit Portal
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-full cursor-pointer"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Hide Details & Careers' : 'Explore Details & Careers'}
        </button>
        
        {expanded && (
          <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-100 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Careers List */}
              <div className={program.requiresConcours && program.examDetails ? "md:col-span-2" : "md:col-span-3"}>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                  <Briefcase size={16} className="text-orange-500" />
                  Potential Career Paths
                </div>
                <div className="flex flex-wrap gap-2">
                  {program.careers && program.careers.length > 0 ? (
                    program.careers.map((career, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-white hover:bg-orange-50/50 border border-slate-200/60 hover:border-orange-200 text-xs font-medium text-slate-600 hover:text-orange-700 rounded-lg transition-all shadow-sm"
                      >
                        {career}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No specific careers listed</span>
                  )}
                </div>
              </div>

              {/* Right Column: Exam Details (Only if applicable) */}
              {program.requiresConcours && program.examDetails && (
                <div className="border-t md:border-t-0 md:border-l border-slate-200/60 pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                    <AlertCircle size={16} className="text-orange-500" />
                    Entrance Exam Details
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Exam:</span>
                      <span className="font-semibold text-slate-800 text-right pl-2">{program.examDetails.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Date:</span>
                      <span className="font-semibold text-slate-800">{program.examDetails.month}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Deadline:</span>
                      <span className="font-semibold text-slate-800">{program.examDetails.deadline}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Fee:</span>
                      <span className="font-semibold text-slate-800">{program.examDetails.fee}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a 
                      href={`https://wa.me/237672507711?text=${encodeURIComponent(`Greetings Sir, i need past questions for ${program.name} (${program.examDetails.name})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      <ExternalLink size={14} />
                      View Past Questions
                    </a>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;

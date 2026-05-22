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
          <div className="mt-4 space-y-4">

              {/* Entrance Exam Details — Bold Standout Callout */}
              {program.requiresConcours && program.examDetails && (
                <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50/60 to-white shadow-md">
                  {/* Thick orange accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-l-xl"></div>
                  
                  <div className="pl-6 pr-5 py-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100">
                        <AlertCircle size={18} className="text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Entrance Exam Required</h4>
                        <p className="text-xs text-orange-600/80 font-medium">{program.examDetails.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="bg-white/70 rounded-lg px-3 py-2.5 border border-orange-100/60">
                        <div className="text-[10px] uppercase tracking-wider text-orange-500/80 font-semibold mb-0.5">Exam Month</div>
                        <div className="text-sm font-bold text-slate-900">{program.examDetails.month}</div>
                      </div>
                      <div className="bg-white/70 rounded-lg px-3 py-2.5 border border-orange-100/60">
                        <div className="text-[10px] uppercase tracking-wider text-orange-500/80 font-semibold mb-0.5">Deadline</div>
                        <div className="text-sm font-bold text-slate-900">{program.examDetails.deadline}</div>
                      </div>
                      <div className="bg-white/70 rounded-lg px-3 py-2.5 border border-orange-100/60">
                        <div className="text-[10px] uppercase tracking-wider text-orange-500/80 font-semibold mb-0.5">Exam Fee</div>
                        <div className="text-sm font-bold text-slate-900">{program.examDetails.fee}</div>
                      </div>
                    </div>

                    <a 
                      href={`https://wa.me/237672507711?text=${encodeURIComponent(`Greetings Sir, i need past questions for ${program.name} (${program.examDetails.name})`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
                    >
                      <ExternalLink size={14} />
                      View Past Questions
                    </a>
                  </div>
                </div>
              )}

              {/* Career Paths Section */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
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

            </div>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;

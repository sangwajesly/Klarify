import React, { useState } from 'react';
import { Building2, Clock, AlertCircle, ChevronDown, ChevronUp, ExternalLink, GraduationCap } from 'lucide-react';

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

      {program.requiresConcours && program.examDetails && (
        <div className="mt-6">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-full"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? 'Hide Exam Details' : 'View Exam Details'}
          </button>
          
          {expanded && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Exam Name</div>
                  <div className="font-medium text-slate-900">{program.examDetails.name}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Testing Month</div>
                  <div className="font-medium text-slate-900">{program.examDetails.month}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Deadline</div>
                  <div className="font-medium text-slate-900">{program.examDetails.deadline}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Exam Fee</div>
                  <div className="font-medium text-slate-900">{program.examDetails.fee}</div>
                </div>
              </div>
              <a 
                href={`https://wa.me/237672507711?text=${encodeURIComponent(`Greetings Sir, i need past questions for ${program.name} (${program.examDetails.name})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                <ExternalLink size={16} />
                View Past Questions
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgramCard;

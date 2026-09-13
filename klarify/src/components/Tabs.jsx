import React, { useState } from 'react';
import { BookOpen, Award, ExternalLink } from 'lucide-react';

const Tabs = ({ certifications, books }) => {
  const [activeTab, setActiveTab] = useState('certifications');

  return (
    <div className="mt-12">
      <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('certifications')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'certifications'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600'
          }`}
        >
          <Award size={18} />
          Certifications
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'books'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600'
          }`}
        >
          <BookOpen size={18} />
          Recommended Reading
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTab === 'certifications' && certifications.map((cert) => (
          <div key={cert.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow flex items-center justify-between group">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">{cert.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{cert.provider}</p>
            </div>
            <a href={cert.url} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
              <ExternalLink size={18} />
            </a>
          </div>
        ))}

        {activeTab === 'books' && books.map((book) => (
          <div key={book.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow flex items-center justify-between group">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">{book.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{book.author}</p>
            </div>
            <a href={book.url} className="text-sm font-medium text-orange-600 hover:text-orange-700">
              Read
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

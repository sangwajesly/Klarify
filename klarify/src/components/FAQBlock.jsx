import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SEOHead from './SEOHead';

const FAQBlock = ({ faqs, title = "Frequently Asked Questions" }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-12 bg-white rounded-2xl shadow-sm border border-slate-100 my-8">
      <SEOHead structuredData={faqSchema} title={title} description={`Answers to common questions about ${title}`} />
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">{title}</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-xl transition-all duration-200 ${isOpen ? 'border-orange-500 bg-orange-50/30' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-lg font-semibold text-slate-800 pr-4">{faq.question}</h3>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>
                
                {isOpen && (
                  <div 
                    id={`faq-answer-${index}`}
                    className="p-5 pt-0 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQBlock;

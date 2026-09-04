import React from "react";
import { ChevronDown } from "lucide-react";
import SEOHead from "./SEOHead";

const FAQBlock = ({ faqs, title = "Frequently Asked Questions" }) => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-12 my-6">
      <SEOHead
        structuredData={faqSchema}
        title={title}
        description={`Answers to common questions about ${title}`}
      />
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
          {title}
        </h2>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 focus:outline-none group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-sm md:text-base font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 group-hover:text-slate-600 shrink-0 transition-transform duration-300 ease-out-expo ${
                      isOpen ? "rotate-180 text-orange-500" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={`faq-answer-${index}`}
                  style={{
                    maxHeight: isOpen ? "500px" : "0",
                    overflow: "hidden",
                    transition:
                      "max-height 320ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <p className="pb-5 text-sm text-slate-500 leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQBlock;

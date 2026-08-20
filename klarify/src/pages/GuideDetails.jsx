import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { fetchGuideBySlug, fetchFeaturedInstitutions, fetchGuides } from "../services/api";

// Interactive Stream Matcher Widget within the dynamic template
const StreamMatcherWidget = () => {
  const [selectedGroup, setSelectedGroup] = useState("science");

  const combinations = {
    science: {
      title: "Science Stream (PCM, MCB, PMCs, etc.)",
      description: "Passed Mathematics, Physics, Chemistry, or Biology? Your options are usually technical, medical, or research-based.",
      options: [
        { name: "Medicine & Health Sciences", details: "Requires Biology & Chemistry. If you passed these, you can sit for the National Medical Exams or apply for Nursing / Medical Lab degrees directly." },
        { name: "Engineering & Tech", details: "Requires Mathematics & Physics. Perfect for Computer Engineering, Electrical Engineering, or Software Engineering." },
        { name: "General Sciences", details: "Chemistry, Biochemistry, or Physics degrees. Offered as direct entry at state universities." },
      ],
    },
    commercial: {
      title: "Commercial Stream (Eco, Accounting, Maths, etc.)",
      description: "Economics, Accounting, and Business Management passes set you up for management, finance, and logistics.",
      options: [
        { name: "Accounting & Finance", details: "Direct entry in major public and private campuses. Always a high-demand career path." },
        { name: "Business Administration", details: "Covers management, human resources, and marketing." },
        { name: "Logistics & Supply Chain", details: "Douala and Limbe ports create thousands of logistics jobs. HND programs are popular here." },
      ],
    },
    arts: {
      title: "Arts & Humanities (LIT, HIS, PHI, etc.)",
      description: "Literature, History, and Philosophy passes prepare you for communication, law, administration, and letters.",
      options: [
        { name: "English Common Law", details: "Highly respected pathway at University of Buea and University of Bamenda. No concours needed." },
        { name: "Journalism & Mass Communication", details: "Great for writing and public speaking. Offers paths into media, PR, and advertising." },
        { name: "Bilingual Letters / Linguistics", details: "Perfect if you pass French and English. Opens doors to translation and teaching careers." },
      ],
    },
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 my-6 text-slate-700">
      <div className="flex gap-2 border-b border-slate-200 pb-3 mb-4 overflow-x-auto">
        {Object.keys(combinations).map((group) => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
              selectedGroup === group
                ? "bg-slate-950 text-white"
                : "bg-slate-200/60 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="space-y-3 text-left">
        <h4 className="font-extrabold text-slate-900 text-sm">{combinations[selectedGroup].title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">{combinations[selectedGroup].description}</p>
        
        <div className="space-y-3">
          {combinations[selectedGroup].options.map((opt, idx) => (
            <div key={idx} className="p-3.5 bg-white border border-slate-200/60 rounded-xl">
              <strong className="text-slate-950 text-xs sm:text-sm block mb-0.5">{opt.name}</strong>
              <p className="text-xs text-slate-500 leading-relaxed">{opt.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GuideDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedGuides, setRelatedGuides] = useState([]);
  const [featuredPartner, setFeaturedPartner] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    Promise.all([
      fetchGuideBySlug(slug),
      fetchGuides(),
      fetchFeaturedInstitutions()
    ]).then(([currArticle, allGuides, partners]) => {
      setArticle(currArticle || null);

      if (currArticle && allGuides) {
        const candidates = allGuides.filter(g => g.slug !== slug);
        let matched = candidates.filter(g => g.category === currArticle.category);
        if (matched.length < 2) {
          const leftovers = candidates.filter(g => g.category !== currArticle.category);
          matched = [...matched, ...leftovers];
        }
        setRelatedGuides(matched.slice(0, 2));
      }

      if (partners && partners.length > 0) {
        const randomIndex = Math.floor(Math.random() * partners.length);
        setFeaturedPartner(partners[randomIndex]);
      }

      setLoading(false);
    }).catch((err) => {
      console.error("Error loading guide details and integrations:", err);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <Layout noPadding={true}>
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500 mb-4" />
          <p className="text-slate-400 text-sm">Loading guide...</p>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout noPadding={false}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
          <p className="text-slate-500 mt-2">The guide you are looking for does not exist or has been moved.</p>
          <Link
            to="/guides"
            className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl"
          >
            Back to Guides Library
          </Link>
        </div>
      </Layout>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "KlarifyPath",
      "logo": "https://www.klarifypath.com/favicon.svg"
    }
  };

  return (
    <Layout noPadding={true}>
      <SEOHead
        title={`${article.title} | KlarifyPath Guides`}
        description={article.description}
        canonicalUrl={`https://www.klarifypath.com/guides/${article.slug}`}
        type="article"
        structuredData={articleSchema}
      />

      {/* Guide Header Banner */}
      <section className="bg-slate-950 text-white border-b border-slate-900 pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl mx-auto z-10 relative">
          <Link
            to="/guides"
            className="inline-flex items-center gap-1.5 text-xs text-orange-400 font-bold uppercase tracking-widest mb-6 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Educational Guides
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>By {article.author}</span>
            <span>&bull;</span>
            <span>{article.readTime}</span>
            <span>&bull;</span>
            <span>{article.date}</span>
          </div>
        </div>
      </section>

      {/* Clean Single-Column Reading Body (Medium style) */}
      <article className="bg-white py-12 px-6">
        <div className="max-w-2xl mx-auto text-slate-700 text-base sm:text-lg leading-relaxed space-y-6">
          {article.content.map((block, idx) => {
            switch (block.type) {
              case "p":
                return (
                  <p key={idx} className={block.fontStyle || ""}>
                    {block.text}
                  </p>
                );
              case "h2":
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 pt-6">
                    {block.text}
                  </h2>
                );
              case "blockquote":
                return (
                  <blockquote key={idx} className="border-l-4 border-orange-500 pl-4 italic text-slate-800 font-medium my-8">
                    "{block.text}"
                  </blockquote>
                );
              case "callout":
                return (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl flex gap-3 text-sm my-6">
                    <Compass className="text-orange-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-slate-600">
                      {block.text}
                    </p>
                  </div>
                );
              case "list":
                const Tag = block.ordered ? "ol" : "ul";
                return (
                  <Tag key={idx} className={`${block.ordered ? "list-decimal" : "list-disc"} pl-6 space-y-2 text-slate-600 text-sm sm:text-base`}>
                    {block.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </Tag>
                );
              case "widget":
                if (block.widgetType === "flowCta") {
                  return (
                    <div key={idx} className="my-8 p-6 bg-orange-50 border border-orange-200 rounded-2xl">
                      <h4 className="font-bold text-slate-900 text-base">{block.text}</h4>
                      <p className="text-sm text-slate-600 mt-1">{block.subtext}</p>
                      <button
                        onClick={() => navigate("/flow")}
                        className="mt-4 inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer border-none"
                      >
                        Explore Recommended Programs
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  );
                }
                if (block.widgetType === "streamMatcher") {
                  return <StreamMatcherWidget key={idx} />;
                }
                return null;
              default:
                return null;
            }
          })}

          {/* Sponsored Partner Placement Card */}
          {featuredPartner && (
            <div className="my-8 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-100/80 text-orange-600 text-[10px] font-bold uppercase tracking-wider">
                  Featured Partner Campus
                </div>
                <h4 className="font-bold text-slate-900 text-base">{featuredPartner.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                  Looking for alternative admission pathways? Explore direct-entry degrees, expert training programs, and HND courses at {featuredPartner.campus} in {featuredPartner.city}.
                </p>
              </div>
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                {featuredPartner.whatsapp_number && (
                  <a
                    href={`https://wa.me/${featuredPartner.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none text-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors border-none decoration-none"
                  >
                    Admission Chat
                  </a>
                )}
                {featuredPartner.website_url && (
                  <a
                    href={featuredPartner.website_url.startsWith("http") ? featuredPartner.website_url : `https://${featuredPartner.website_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none text-center px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors border-none decoration-none"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Bottom CTA block */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Orientation Tool</p>
              <h4 className="font-extrabold text-slate-900 text-base mt-0.5">Let Klarify help you explore your options</h4>
            </div>
            <button
              onClick={() => navigate("/flow")}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 border-none"
            >
              Start Subject Assessment &rarr;
            </button>
          </div>
        </div>
      </article>

      {/* Related Guides Section */}
      {relatedGuides.length > 0 && (
        <section className="bg-slate-50 py-16 px-6 border-t border-slate-100">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-extrabold text-slate-900 mb-8 tracking-tight">Related Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedGuides.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/guides/${item.slug}`)}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md hover:border-orange-500/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-wider">
                        <span>{item.category}</span>
                        <span>&bull;</span>
                        <span>{item.readTime}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 group-hover:text-orange-500 transition-colors text-sm sm:text-base leading-snug tracking-tight mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default GuideDetails;

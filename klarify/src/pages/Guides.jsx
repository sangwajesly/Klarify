import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Compass, ArrowUpRight, Bell, Zap } from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { fetchGuides } from "../services/api";

// Customized Card Component matching the user's provided screenshot
const BlogCard = ({ article, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:shadow-md hover:border-orange-500/20 transition-all duration-300 cursor-pointer group"
    >
      {/* Top rounded image spanning full width */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Card Content block */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Author • Read Time */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
            <span>{article.author}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              {article.readTime}
            </span>
          </div>

          {/* Title & ArrowUpRight icon */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h4 className="font-extrabold text-slate-900 group-hover:text-orange-500 transition-colors text-base leading-snug tracking-tight">
              {article.title}
            </h4>
            <ArrowUpRight
              size={18}
              className="text-slate-400 group-hover:text-orange-500 shrink-0 transition-colors mt-0.5"
            />
          </div>

          {/* Teaser Description */}
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">
            {article.description}
          </p>
        </div>

        {/* Footer: Category Pill (left) & Date (right) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <span className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-slate-100 rounded-lg select-none">
            {article.category}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {article.date}
          </span>
        </div>
      </div>
    </div>
  );
};

const Guides = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [subscribed, setSubscribed] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides().then((data) => {
      setArticles(data || []);
      setLoading(false);
    });
  }, []);

  // Filtering Logic
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = ["All", "Concours", "Orientation", "Gap Year"];

  const handleCardClick = (article) => {
    if (article.published) {
      navigate(`/guides/${article.slug}`);
    }
  };

  return (
    <Layout noPadding={true}>
      <SEOHead
        title="Educational Guides & Reading Library | Klarify"
        description="Browse premium articles on university orientation, GCE results, concours preparation, and skill-building in Cameroon."
        canonicalUrl="https://www.klarifypath.com/guides"
      />

      {/* Magazine Header */}
      <section className="bg-slate-950 text-white border-b border-slate-900 pt-28 pb-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-semibold mb-4">
              <Compass size={14} />
              Orientation Guides
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Educational Guides
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl">
              Practical recovery roadmaps, concours alternative guides, and
              skill development articles customized for the Cameroonian
              education landscape.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Category Navigation Bar */}
      <section className="bg-white border-b border-slate-200/80 sticky top-14.25 z-40 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-3.5 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              disabled={loading}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              } ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Blog Feed Grid */}
          <div className="lg:col-span-8 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl border border-slate-250/80 p-5 space-y-4 animate-pulse"
                  >
                    <div className="aspect-video w-full bg-slate-200 rounded-xl" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6">
                <p className="text-slate-500 font-medium">
                  No guides match your search or category selection.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <BlogCard
                    key={article.id}
                    article={article}
                    onClick={() => handleCardClick(article)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Magazine Newsletter Signup Card */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-850 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mb-4">
                <Bell size={20} />
              </div>
              <h4 className="font-bold text-white text-base">
                Subscribe to Recovery Series
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed mb-6">
                Enter your email address to receive immediate updates when our
                orientation counselors publish new guides on university and
                career resets.
              </p>

              {subscribed ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl text-center">
                  Successfully subscribed!
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubscribed(true);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Subscribe &rarr;
                  </button>
                </form>
              )}
            </div>

            {/* Quick Assessment Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap size={22} className="text-orange-500" />
              </div>
              <h4 className="font-black text-slate-900 text-sm">
                Orientation Recommender
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5 mb-5">
                Match your A-Level combination with state university programs
                and concours across Cameroon instantly.
              </p>
              <button
                onClick={() => navigate("/flow")}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Start Assessment Free
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Guides;

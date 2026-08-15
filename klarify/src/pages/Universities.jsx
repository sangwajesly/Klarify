import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  Award,
  Search,
  Loader2,
  ArrowRight,
  MapPin,
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { fetchAllUniversities } from "../services/api";

const UNI_METADATA = {
  "University of Buea": {
    city: "Buea, South West",
    established: "1993",
    type: "Public State University",
    tagline: "The Place to Be — Anglo-Saxon Excellence in Cameroon.",
    description:
      "The University of Buea is Cameroon's premier Anglo-Saxon university offering programs across Arts, Social Sciences, Engineering, Education, and Health Sciences.",
  },
  "University of Bamenda": {
    city: "Bambili, North West",
    established: "2010",
    type: "Public State University",
    tagline: "Education for Development and Innovation.",
    description:
      "Located in Bambili, the University of Bamenda is home to prestigious schools such as COLTECH, HTTTC, NAHPI, and the Faculty of Science.",
  },
  "University of Yaounde I": {
    city: "Ngoa-Ekelle, Yaounde",
    established: "1962 / 1993",
    type: "Public State University",
    tagline: "Sapientia, Disciplina, Labor.",
    description:
      "Cameroon's flagship bilingual university housing ENSP (National Advanced School of Engineering) and FMSB (Faculty of Medicine).",
  },
  "University of Douala": {
    city: "Douala, Littoral",
    established: "1993",
    type: "Public State University",
    tagline: "Economic Capital Center for Tech & Business.",
    description:
      "Situated in the commercial capital, known for ENSET, ESSEC Business School, and robust industrial technology degree paths.",
  },
  "University of Dschang": {
    city: "Dschang, West Region",
    established: "1993",
    type: "Public State University",
    tagline: "Research, Agronomy, & Humanities.",
    description:
      "Famed for FASA (Faculty of Agronomy and Agricultural Sciences) and comprehensive programs in science, law, and medicine.",
  },
  "University of Maroua": {
    city: "Maroua, Far North",
    established: "2008",
    type: "Public State University",
    tagline: "Teacher Training & Renewable Energy.",
    description:
      "Home to the renowned École Normale Supérieure (ENS) Maroua and specialized institutes in solar energy and Sahelian agriculture.",
  },
  "University of Ngaoundere": {
    city: "Ngaoundere, Adamawa",
    established: "1993",
    type: "Public State University",
    tagline: "Food Science & Industrial Technology.",
    description:
      "Leading institution for ENSAI (National Advanced School of Agro-Industrial Sciences) and veterinary medicine.",
  },
};

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadUnis = async () => {
      setLoading(true);
      try {
        const data = await fetchAllUniversities();
        setUniversities(data);
      } catch (err) {
        console.error("Failed to load universities:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUnis();
  }, []);

  const filteredUniversities = universities.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = u.name.toLowerCase().includes(q);
    const meta = UNI_METADATA[u.name];
    const cityMatch = meta?.city.toLowerCase().includes(q);
    const facMatch = u.faculties.some((f) => f.toLowerCase().includes(q));
    return nameMatch || cityMatch || facMatch;
  });

  return (
    <Layout>
      <SEOHead
        title="State Universities & Higher Institutes in Cameroon | KlarifyPath"
        description="Discover state universities in Cameroon including University of Buea, University of Bamenda, University of Yaounde I, Douala, and Dschang."
        canonicalUrl="https://www.klarifypath.com/universities"
      />

      <main className="py-6 pb-20">
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="section-eyebrow block mb-2">
            Higher Education Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Universities & Institutions in Cameroon
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Explore state public universities, professional schools (ENSP, FMSB,
            ENS, COLTECH), and private higher institutes across the national
            territory.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto mt-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search university by name, city, or faculty..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-900 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={32} />
          </div>
        ) : filteredUniversities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUniversities.map((uni) => {
              const meta = UNI_METADATA[uni.name] || {
                city: "Cameroon National Territory",
                type: "Public Higher Institution",
                tagline: "Higher Academic & Professional Education",
                description:
                  "State recognized institution providing degree programs across various faculties.",
              };

              return (
                <div
                  key={uni.name}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 font-extrabold text-lg">
                        <Building2 size={24} />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          <MapPin size={12} className="text-orange-500" />
                          {meta.city}
                        </span>
                        {uni.isPrivate && (
                          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-white bg-orange-600 px-2 py-1 rounded-md">
                            Private Institute
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-1">
                      {uni.name}
                    </h2>
                    <p className="text-xs font-semibold text-orange-600 mb-3">
                      {meta.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {meta.description}
                    </p>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100 mb-6 text-center">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Programs
                        </span>
                        <span className="block text-sm font-bold text-slate-900">
                          {uni.programCount}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Concours
                        </span>
                        <span className="block text-sm font-bold text-slate-900">
                          {uni.concoursCount}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Faculties
                        </span>
                        <span className="block text-sm font-bold text-slate-900">
                          {uni.facultiesCount}
                        </span>
                      </div>
                    </div>

                    {/* Faculties preview pills */}
                    {uni.faculties.length > 0 && (
                      <div className="mb-6">
                        <span className="block text-[11px] uppercase font-bold text-slate-400 mb-2">
                          Key Faculties / Schools
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {uni.faculties.slice(0, 4).map((fac, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-medium rounded-md"
                            >
                              {fac}
                            </span>
                          ))}
                          {uni.faculties.length > 4 && (
                            <span className="px-2 py-1 text-slate-400 text-[11px] font-medium">
                              +{uni.faculties.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center sm:justify-between gap-3">
                    <Link
                      to={`/universities/${encodeURIComponent(uni.name)}`}
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold sm:px-4 sm:py-2.5 px-3 py-2 rounded-xl transition-colors w-full sm:w-auto justify-center"
                    >
                      Explore Programs & Faculties
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      to={`/programs?university=${encodeURIComponent(uni.name)}`}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      View Catalog ➔
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Building2 className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No institutions found
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-4">
              No university matches your search term "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Universities;

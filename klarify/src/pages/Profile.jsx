import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Bookmark, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getSavedPrograms, removeSavedProgram } from "../services/api";
import Layout from "../components/Layout";
import ProgramCard from "../components/ProgramCard";
import SEOHead from "../components/SEOHead";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [savedPrograms, setSavedPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/profile" } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (user) {
        try {
          const programs = await getSavedPrograms(user.id);
          setSavedPrograms(programs);
        } catch (error) {
          console.error("Failed to load saved programs", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPrograms();
  }, [user]);

  const handleRemoveSavedProgram = async (programId) => {
    if (!user) return;
    try {
      await removeSavedProgram(user.id, programId);
      setSavedPrograms((prev) => prev.filter((p) => p.id !== programId));
    } catch (error) {
      console.error("Failed to remove program", error);
    }
  };

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="My Profile | Klarify"
        description="View your saved university and career recommendations in Cameroon."
      />
      <div className="max-w-4xl mx-auto py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <User size={40} className="text-orange-500" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              My Profile
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-600">
              <Mail size={16} />
              <span>{user.email || user.phone || "User"}</span>
            </div>
          </div>
        </div>

        {/* Saved Programs Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Bookmark className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold text-slate-900">
              Saved Recommendations
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 bg-white rounded-xl border border-slate-100">
              <Loader2 className="animate-spin text-orange-500" size={24} />
            </div>
          ) : savedPrograms.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {savedPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  isSaved={true}
                  onRemove={handleRemoveSavedProgram}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                No saved programs
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                You haven't saved any recommendations yet. Go to the flow to
                discover and save programs you're interested in.
              </p>
              <button
                onClick={() => navigate("/flow")}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
              >
                Find Programs
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

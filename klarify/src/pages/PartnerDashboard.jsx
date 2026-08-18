import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  BookOpen,
  PlusCircle,
  CheckCircle2,
  MapPin,
  Globe,
  Phone,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useAuth } from "../context/AuthContext";
import {
  getPartnerProfile,
  fetchPartnerInstitutionPrograms,
  initiateSubscriptionPayment,
} from "../services/api";

const PartnerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [institution, setInstitution] = useState(null);
  const [programsCount, setProgramsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/partner/login");
      } else if (user.user_metadata?.user_type !== "INSTITUTION_ADMIN") {
        navigate("/");
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        setLoading(true);
        try {
          const profile = await getPartnerProfile(user.id);
          const inst = profile || {
            name: user.user_metadata?.full_name
              ? `${user.user_metadata.full_name}'s Institute`
              : "Private University Partner",
            city: "Douala / Yaounde",
            campus: "Main Campus",
            verification_status: "PENDING",
            subscription_tier: "STARTER",
          };
          setInstitution(inst);

          const progs = await fetchPartnerInstitutionPrograms(
            inst.id,
            inst.name,
          );
          setProgramsCount(progs.length);
        } catch (err) {
          console.error("Failed to load partner dashboard data:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadProfileData();
  }, [user]);

  const handleUpgrade = async (amount, planName) => {
    if (!institution?.id) return;
    setPaymentLoading(true);
    try {
      const resp = await initiateSubscriptionPayment(institution.id, amount, `Upgrade to ${planName} Plan`);
      if (resp.checkout_url) {
        window.location.href = resp.checkout_url;
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-28">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Partner Dashboard | Klarify"
        description="Manage your private university programs, campus locations, and tuition fees."
      />

      <main className="py-6 pb-20 max-w-5xl mx-auto">
        {location.state?.justRegistered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold">
            <CheckCircle2 size={20} className="text-green-500 shrink-0" />
            <span>
              Welcome to Klarify! Your university portal profile has been
              created. Start adding your courses below.
            </span>
          </div>
        )}

        {/* Institution Header Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                <Building2 size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {institution?.verification_status === "VERIFIED" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                      Verified Partner
                    </span>
                  )}

                  {institution?.verification_status === "PENDING" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                      Pending Verification
                    </span>
                  )}

                  {institution?.verification_status === "SUSPENDED" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                      Suspended
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {institution?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-orange-400" />
                    {institution?.city || "Cameroon"} (
                    {institution?.campus || "Main Campus"})
                  </span>
                  {institution?.whatsapp_number && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-orange-400" />+
                      {institution.whatsapp_number}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              to="/partner/programs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 shrink-0"
            >
              <PlusCircle size={18} />
              Add / Manage Programs
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Listed Programs
              </span>
              <span className="text-3xl font-extrabold text-slate-900">
                {programsCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
              <BookOpen size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Active Status
              </span>
              <span className="text-base font-bold text-green-600">
                {institution?.subscription_tier || "STARTER"} Plan
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                WhatsApp Leads
              </span>
              <span className="text-base font-bold text-slate-900">
                Direct Contact
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Phone size={24} />
            </div>
          </div>
        </div>

        {/* Subscription Upgrades */}
        {(institution?.subscription_tier === "STARTER" || !institution?.subscription_tier) && (
          <div className="bg-orange-50 rounded-3xl p-6 sm:p-8 border border-orange-200 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Upgrade your Portal Plan</h2>
              <p className="text-sm text-slate-600">
                You are currently on the Free Starter plan. Upgrade to unlock unlimited programs, direct WhatsApp leads, and priority ranking.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => handleUpgrade(150000, "PRO")}
                disabled={paymentLoading}
                className="px-5 py-3 bg-white border border-orange-300 text-orange-600 font-bold text-sm rounded-xl hover:bg-orange-100 transition-colors disabled:opacity-50"
              >
                {paymentLoading ? "Please wait..." : "Upgrade to PRO (150k XAF)"}
              </button>
              <button
                onClick={() => handleUpgrade(350000, "FEATURED")}
                disabled={paymentLoading}
                className="px-5 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 transition-colors disabled:opacity-50"
              >
                {paymentLoading ? "Please wait..." : "Get FEATURED (350k XAF)"}
              </button>
            </div>
          </div>
        )}

        {/* Management Quick Actions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Portal Management Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/partner/programs"
              className="p-5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-200 transition-all flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors flex items-center justify-between">
                  Manage Academic Courses
                  <ArrowRight size={16} />
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Add new Bachelor's, HNDs, or Master's programs with tuition
                  fees, prerequisites, and campus locations.
                </p>
              </div>
            </Link>

            <Link
              to={`/universities`}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 transition-all flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-700 transition-colors flex items-center justify-between">
                  View Public Directory Listing
                  <Globe size={16} />
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  See how students view your university campus and courses in
                  the main Klarify Directory.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PartnerDashboard;

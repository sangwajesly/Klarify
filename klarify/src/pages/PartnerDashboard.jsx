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
  X,
  AlertCircle,
  CreditCard,
  Calendar,
  Zap,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import {
  getPartnerProfile,
  fetchPartnerInstitutionPrograms,
  initiateSubscriptionPayment,
  recoverPartnerProfile,
  initiateDirectPayment,
  checkPaymentStatus,
} from "../services/api";

const PARTNER_TYPE_LABELS = {
  university: "Higher Institute (IPES)",
  tech_academy: "Tech Academy & Bootcamp",
  vocational_center: "Vocational & Trade Hub",
  company: "Company & Hiring Partner",
};

const PartnerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [institution, setInstitution] = useState(null);
  const [programsCount, setProgramsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "plans", "profile"

  // Custom Direct Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // { amount, name, duration }
  const [payerPhone, setPayerPhone] = useState("");
  const [payerName, setPayerName] = useState("");
  const [paymentStep, setPaymentStep] = useState("input"); // "input", "processing", "success", "failed"
  const [paymentError, setPaymentError] = useState("");
  const [activeTransId, setActiveTransId] = useState(null);

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCampus, setEditCampus] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditError("Institution name is required.");
      return;
    }
    setEditLoading(true);
    setEditError("");
    try {
      const { data, error } = await supabase
        .from("institutions")
        .update({
          name: editName.trim(),
          city: editCity.trim(),
          campus: editCampus.trim(),
          whatsapp_number: editWhatsapp.trim(),
          website_url: editWebsite.trim(),
        })
        .eq("id", institution.id)
        .select();

      if (error) throw error;

      setInstitution({
        ...institution,
        name: editName.trim(),
        city: editCity.trim(),
        campus: editCampus.trim(),
        whatsapp_number: editWhatsapp.trim(),
        website_url: editWebsite.trim(),
      });
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setEditError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

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
    const loadData = async () => {
      if (!user) return;
      try {
        let inst = null;
        try {
          inst = await getPartnerProfile();
        } catch (fetchErr) {
          console.warn("Direct partner fetch failed, trying recovery...", fetchErr);
        }

        if (!inst && user.id) {
          inst = await recoverPartnerProfile(user);
        }

        if (inst) {
          setInstitution(inst);
          const progs = await fetchPartnerInstitutionPrograms(inst.id, inst.name);
          setProgramsCount(progs.length);
        }
      } catch (err) {
        console.error("Error loading partner dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const handleUpgrade = (amount, name, duration = "12 Months") => {
    setSelectedPlan({ amount, name, duration });
    setPayerName(user?.user_metadata?.full_name || institution?.name || "");
    setPayerPhone(institution?.whatsapp_number?.replace(/\D/g, "") || "");
    setPaymentStep("input");
    setPaymentError("");
    setShowPaymentModal(true);
  };

  const processDirectPayment = async (e) => {
    e.preventDefault();
    if (!payerPhone || !payerName) {
      setPaymentError("Please provide both your name and Mobile Money phone number.");
      return;
    }

    setPaymentLoading(true);
    setPaymentError("");

    try {
      const resp = await initiateDirectPayment({
        amount: selectedPlan.amount,
        phone: payerPhone.trim(),
        name: payerName.trim(),
        tierName: selectedPlan.name,
        institutionId: institution.id,
      });

      if (resp && resp.transId) {
        setActiveTransId(resp.transId);
        setPaymentStep("processing");
        pollPaymentStatus(resp.transId);
      } else {
        throw new Error(resp?.message || "Failed to initiate payment session.");
      }
    } catch (err) {
      console.error("Direct payment initiation error:", err);
      setPaymentError(err.message || "Failed to send payment request. Check your number.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const pollPaymentStatus = (transId) => {
    let attempts = 0;
    const maxAttempts = 24; // Poll every 5s for 2 minutes

    const interval = setInterval(async () => {
      attempts += 1;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        setPaymentStep("failed");
        setPaymentError("Payment authorization timed out. Please try again.");
        return;
      }

      try {
        const statusResp = await checkPaymentStatus(transId);
        const status = (statusResp.status || "").toUpperCase();

        if (status === "SUCCESSFUL") {
          clearInterval(interval);
          setPaymentStep("success");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else if (status === "FAILED" || status === "EXPIRED") {
          clearInterval(interval);
          setPaymentStep("failed");
          setPaymentError(statusResp.message || "Transaction was declined or failed on your device.");
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
      }
    }, 5000);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-secondary-600 dark:text-secondary-400" size={32} />
        </div>
      </Layout>
    );
  }

  const isStarter = !institution?.subscription_tier || institution?.subscription_tier === "STARTER";

  return (
    <Layout>
      <SEOHead
        title="Partner Dashboard | Klarify"
        description="Manage your private university programs, campus locations, and tuition fees."
      />

      <main className="py-4 sm:py-6 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
        {location.state?.justRegistered && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold">
            <CheckCircle2 size={20} className="text-green-500 shrink-0" />
            <span>
              Welcome to Klarify! Your organization portal profile has been created. Start adding your courses below.
            </span>
          </div>
        )}

        {/* ── Executive Workspace Header (Unified, Modern) ── */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-800 mb-6 relative overflow-hidden">
          <img
            src="/klarify-mark-white.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-8 -bottom-8 w-44 h-44 opacity-5 pointer-events-none select-none"
          />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary-500/20 border border-secondary-500/30 text-secondary-400 flex items-center justify-center shrink-0">
                <Building2 size={28} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                    {PARTNER_TYPE_LABELS[institution?.partner_type] || "Higher Institute (IPES)"}
                  </span>
                  {institution?.verification_status === "VERIFIED" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                      Verified Partner
                    </span>
                  )}
                  {institution?.verification_status === "PENDING" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                      Pending Verification
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>{institution?.name}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-secondary-400 shrink-0" />
                    {institution?.city || "Cameroon"} ({institution?.campus || "Main Campus"})
                  </span>
                  {institution?.whatsapp_number && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-secondary-400 shrink-0" />
                      +{institution.whatsapp_number}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setEditName(institution?.name || "");
                  setEditCity(institution?.city || "");
                  setEditCampus(institution?.campus || "");
                  setEditWhatsapp(institution?.whatsapp_number || "");
                  setEditWebsite(institution?.website_url || "");
                  setEditError("");
                  setShowEditModal(true);
                }}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl transition-all cursor-pointer border border-white/10"
              >
                <span>Edit Profile</span>
              </button>

              <Link
                to="/partner/programs"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-secondary-500/25 shrink-0"
              >
                <PlusCircle size={16} />
                <span>Manage Programs</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Cohesive Executive Metrics Strip (Single Surface, Zero Blockiness) ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 overflow-hidden">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Listed Programs
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {programsCount}
                </span>
                <span className="text-xs text-slate-400">
                  {isStarter ? "/ 3 Starter" : "Unlimited"}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-secondary-400 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Active Tier
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {institution?.subscription_tier || "STARTER"}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap size={20} />
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Admissions WhatsApp
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate block max-w-[180px]">
                {institution?.whatsapp_number ? `+${institution.whatsapp_number}` : "Not Connected"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Phone size={20} />
            </div>
          </div>
        </div>

        {/* ── Segmented Navigation Tabs ── */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 hide-scrollbar border-b border-slate-200/80 dark:border-slate-800">
          {[
            { id: "overview", label: "Overview & Studio" },
            { id: "plans", label: isStarter ? "Upgrade Options" : "Subscription Plans" },
            { id: "profile", label: "Campus Information" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap mb-1.5 ${
                  isActive
                    ? "bg-primary-500 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: OVERVIEW & STUDIO ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Starter Notification Banner */}
            {isStarter && (
              <div className="p-4 sm:p-5 rounded-2xl bg-secondary-500/10 dark:bg-secondary-500/15 border border-secondary-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary-500 text-slate-950 inline-block mb-1">
                    Free Starter Plan
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    You can list up to <strong>3 programs</strong> for free. Upgrade to list unlimited courses and unlock priority student ranking in the Klarify Orientation Recommender.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("plans")}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-black text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Explore Plans</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Studio Action Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/partner/programs"
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-secondary-500 dark:hover:border-secondary-500 transition-all flex items-start gap-4 group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-secondary-400 transition-colors flex items-center justify-between">
                    <span>Manage Academic Programs</span>
                    <ArrowRight size={16} />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Add new Bachelor's, HNDs, or Master's programs with tuition fees, prerequisites, and campus locations.
                  </p>
                </div>
              </Link>

              <Link
                to={`/universities`}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all flex items-start gap-4 group shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Globe size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-secondary-400 transition-colors flex items-center justify-between">
                    <span>Public Directory Listing</span>
                    <ExternalLink size={16} />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    View how students search and discover your campus in the main Cameroon University Directory.
                  </p>
                </div>
              </Link>
            </div>

            {/* Program Health & Admissions Status */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                Student Matching & Inquiries
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                When students complete their A-Level or Skill Gap Recommender assessment, Klarify matches your accredited programs and presents direct WhatsApp contact buttons for immediate admissions counseling.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 2: SUBSCRIPTION PLANS ── */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Flexible Organization Membership Plans
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Choose a flexible cohort pass for seasonal bootcamps, or an institutional annual plan for year-round university degrees.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Option 1: Flexible Cohort Pass (1, 3, or 6 Months) */}
              <div className="rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300">
                      Bootcamps & Cohorts
                    </span>
                    <Clock size={16} className="text-primary-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Flexible Cohort Pass
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                    Designed for tech bootcamps, vocational trades, and internship programs running timed cycles.
                  </p>

                  <div className="space-y-2 mb-5">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Choose Duration:</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: "1 Mo", livePrice: 25000, testPrice: 50, durationText: "1 Month" },
                        { label: "3 Mo", livePrice: 60000, testPrice: 100, durationText: "3 Months" },
                        { label: "6 Mo", livePrice: 100000, testPrice: 150, durationText: "6 Months" },
                      ].map((item) => {
                        const price = user?.email === "sangwajesly82@gmail.com" ? item.testPrice : item.livePrice;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => handleUpgrade(price, "Flexible Cohort Pass", item.durationText)}
                            className="p-2.5 rounded-xl border border-primary-200 dark:border-primary-800/80 bg-white dark:bg-slate-900 hover:bg-primary-500 hover:text-white transition-all text-center cursor-pointer group"
                          >
                            <span className="block text-[11px] font-extrabold text-slate-900 dark:text-white group-hover:text-white">
                              {item.label}
                            </span>
                            <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-primary-100">
                              {price.toLocaleString()} XAF
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-primary-500 shrink-0" />
                      <span>Unlimited cohort & course listings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-primary-500 shrink-0" />
                      <span>Direct WhatsApp inquiry button</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-primary-500 shrink-0" />
                      <span>Matched in Skill Gap Recommender</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Option 2: Annual Institutional (12 Months) */}
              <div className="rounded-2xl p-5 sm:p-6 border-2 border-secondary-500/50 bg-secondary-500/5 dark:bg-slate-900 flex flex-col justify-between relative shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-950/60 text-secondary-800 dark:text-secondary-300">
                      Universities & IPES
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary-500 text-slate-950">
                      Annual
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Annual Institutional
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                    Full 12-month platform presence for private universities, polytechnics, and academic faculties.
                  </p>

                  <div className="mb-5">
                    <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {user?.email === "sangwajesly82@gmail.com" ? "200" : "150,000"}{" "}
                      <span className="text-xs font-bold text-slate-400">XAF / Year</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">365-day verified placement</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-secondary-600 dark:text-secondary-400 shrink-0" />
                      <span>Unlimited Degree, HND & Master's</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-secondary-600 dark:text-secondary-400 shrink-0" />
                      <span>Direct WhatsApp admissions leads</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-secondary-600 dark:text-secondary-400 shrink-0" />
                      <span>Verified Institution Badge</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleUpgrade(
                      user?.email === "sangwajesly82@gmail.com" ? 200 : 150000,
                      "Annual Institutional",
                      "12 Months"
                    )
                  }
                  className="w-full py-3 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-secondary-500/20 transition-all cursor-pointer"
                >
                  Get Annual Institutional
                </button>
              </div>

              {/* Option 3: Featured Partner Pass (Top Priority) */}
              <div className="rounded-2xl p-5 sm:p-6 border border-slate-800 bg-slate-900 text-white flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-500/20 text-secondary-400">
                      Maximum Reach
                    </span>
                    <Sparkles size={16} className="text-secondary-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Featured Priority Pass
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                    Pin your campus or academy to the top of all search queries and homepage recommendation banners.
                  </p>

                  <div className="mb-5">
                    <div className="text-2xl font-black text-white tracking-tight">
                      {user?.email === "sangwajesly82@gmail.com" ? "300" : "350,000"}{" "}
                      <span className="text-xs font-bold text-slate-400">XAF / Year</span>
                    </div>
                    <span className="text-[11px] text-secondary-400 block mt-0.5">Top rank across all filters</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-secondary-400 shrink-0" />
                      <span>All Institutional features included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-secondary-400 shrink-0" />
                      <span>#1 Priority in orientation results</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-secondary-400 shrink-0" />
                      <span>Featured Banner on Homepage</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleUpgrade(
                      user?.email === "sangwajesly82@gmail.com" ? 300 : 350000,
                      "Featured Priority",
                      "12 Months"
                    )
                  }
                  className="w-full py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Get Featured Priority
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: CAMPUS PROFILE ── */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Campus & Accreditation Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verified institutional information displayed to prospective students.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditName(institution?.name || "");
                  setEditCity(institution?.city || "");
                  setEditCampus(institution?.campus || "");
                  setEditWhatsapp(institution?.whatsapp_number || "");
                  setEditWebsite(institution?.website_url || "");
                  setEditError("");
                  setShowEditModal(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Institution Name
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{institution?.name}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Headquarters & Campus
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {institution?.city || "Cameroon"} ({institution?.campus || "Main Campus"})
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Admissions WhatsApp Line
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {institution?.whatsapp_number ? `+${institution.whatsapp_number}` : "Not Set"}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Official Website
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate block">
                  {institution?.website_url || "Not Set"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Custom Direct Payment Modal Overlay ── */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left">
              {paymentStep !== "processing" && paymentStep !== "success" && (
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}

              {paymentStep === "input" && (
                <form onSubmit={processDirectPayment} className="space-y-5">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-secondary-400">Upgrade Portal</span>
                    <h3 className="text-xl font-extrabold text-white mt-1">
                      {selectedPlan.name} {selectedPlan.duration ? `(${selectedPlan.duration})` : "Plan"}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Unlock full orientation analytics, priority ranking, and direct WhatsApp student leads.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Total Price</span>
                      <span className="block text-xl font-black text-white mt-0.5">
                        {selectedPlan.amount.toLocaleString()} XAF
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-secondary-500/20 text-secondary-400 text-xs font-bold border border-secondary-500/30">
                      {selectedPlan.duration ? `${selectedPlan.duration} Access` : "One-time charge"}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Payer Name
                      </label>
                      <input
                        type="text"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        required
                        placeholder="e.g. Sangwa Jesly"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-secondary-500 rounded-xl text-white text-sm focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Mobile Money Phone Number (MTN / Orange)
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={payerPhone}
                          onChange={(e) => setPayerPhone(e.target.value)}
                          required
                          placeholder="e.g. 682833601"
                          className="w-full pl-4 pr-16 py-3 bg-white/5 border border-white/10 focus:border-secondary-500 rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 pointer-events-none select-none">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">MoMo</span>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-secondary-500/20 text-secondary-400 border border-secondary-500/30">OM</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                        Enter your Cameroonian mobile money number without country code (e.g. 6xxxxxxxx). A payment validation prompt will be pushed to your handset.
                      </p>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed">
                      <AlertCircle className="shrink-0 mt-0.5" size={16} />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={paymentLoading}
                    className="w-full py-3.5 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-secondary-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Sending Mobile Prompt...</span>
                      </>
                    ) : (
                      <>
                        <span>Authorize {selectedPlan.amount.toLocaleString()} XAF Payment</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {paymentStep === "processing" && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-secondary-500/20 text-secondary-400 flex items-center justify-center mx-auto animate-pulse">
                    <Loader2 className="animate-spin" size={32} />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Prompt Sent to Handset</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Check your phone now and dial your Mobile Money PIN to approve the transfer of{" "}
                    <strong className="text-white">{selectedPlan.amount.toLocaleString()} XAF</strong>.
                  </p>
                </div>
              )}

              {paymentStep === "success" && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Payment Confirmed!</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Your institutional portal has been upgraded to {selectedPlan.name}. Reloading workspace...
                  </p>
                </div>
              )}

              {paymentStep === "failed" && (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                    <AlertCircle size={36} />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Transaction Not Completed</h3>
                  <p className="text-xs text-red-400 max-w-xs mx-auto leading-relaxed">
                    {paymentError || "The prompt expired or was declined on your handset."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPaymentStep("input")}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Edit Profile Modal ── */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Edit Organization Profile
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Update your campus name, location, and admissions line.
                  </p>
                </div>

                {editError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl">
                    {editError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="e.g. Douala"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Campus Name
                    </label>
                    <input
                      type="text"
                      value={editCampus}
                      onChange={(e) => setEditCampus(e.target.value)}
                      placeholder="e.g. Bonaberi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Admissions WhatsApp Line
                  </label>
                  <input
                    type="tel"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    placeholder="e.g. 237682833601"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {editLoading ? <Loader2 size={14} className="animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default PartnerDashboard;

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

  // Custom Direct Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // { amount, name }
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
    const loadProfileData = async () => {
      if (user) {
        setLoading(true);
        try {
          let profile = await getPartnerProfile(user.id);

          if (!profile && user.user_metadata?.user_type === "INSTITUTION_ADMIN") {
            try {
              profile = await recoverPartnerProfile(user);
            } catch (recoveryErr) {
              console.error("Auto-recovery of partner profile failed:", recoveryErr);
            }
          }

          const inst = profile || {
            id: "temp-ipes-id",
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

  const handleUpgrade = (amount, planName, duration = "") => {
    setSelectedPlan({ amount, name: planName, duration });
    setPayerName(user?.user_metadata?.full_name || "");
    setPayerPhone("");
    setPaymentStep("input");
    setPaymentError("");
    setShowPaymentModal(true);
  };

  const processDirectPayment = async (e) => {
    e.preventDefault();
    if (!payerPhone || payerPhone.trim().length < 9) {
      setPaymentError("Please enter a valid 9-digit mobile phone number.");
      return;
    }

    setPaymentStep("processing");
    setPaymentError("");

    const planLabel = selectedPlan.duration
      ? `Upgrade to ${selectedPlan.name} (${selectedPlan.duration})`
      : `Upgrade to ${selectedPlan.name} Plan`;

    try {
      const resp = await initiateDirectPayment({
        institutionId: institution.id,
        amount: selectedPlan.amount,
        phone: payerPhone.trim(),
        name: payerName,
        email: user?.email,
        description: planLabel,
      });

      if (resp.success && resp.provider_reference) {
        setActiveTransId(resp.provider_reference);
        startPaymentStatusPolling(resp.provider_reference);
      } else {
        throw new Error("Failed to initiate direct payment prompt.");
      }
    } catch (err) {
      console.error("Direct payment initiation error:", err);
      const errMsg = err.response?.data?.detail || err.message || "";
      
      // If Fapshi returns a Forbidden error regarding Direct Pay activation:
      if (errMsg.includes("Forbidden request") || errMsg.includes("activate-direct-pay")) {
        setPaymentError("Direct MoMo prompt is not activated on your Fapshi merchant account. Redirecting you to the secure checkout page...");
        try {
          // Trigger fallback hosted checkout redirect after a short delay
          setTimeout(async () => {
            try {
              const hostedResp = await initiateSubscriptionPayment(
                institution.id,
                selectedPlan.amount,
                planLabel
              );
              if (hostedResp.checkout_url) {
                window.location.href = hostedResp.checkout_url;
              } else {
                throw new Error("Hosted payment link generation failed.");
              }
            } catch (hostedErr) {
              console.error("Fallback payment link generation failed:", hostedErr);
              setPaymentError("Fallback payment generation failed. Please contact Fapshi to activate Direct Pay, or try again later.");
              setPaymentStep("failed");
            }
          }, 3000);
          return;
        } catch (fallbackErr) {
          // Fall through
        }
      }

      setPaymentError(
        errMsg || "Payment failed. Please confirm the number is active and try again."
      );
      setPaymentStep("failed");
    }
  };

  const startPaymentStatusPolling = (transId) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes (every 5 seconds)

    const interval = setInterval(async () => {
      attempts++;
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
        <div className="flex justify-center items-center py-28">
          <Loader2 className="animate-spin text-secondary-600 dark:text-secondary-400" size={32} />
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
              <div className="w-16 h-16 rounded-2xl bg-secondary-500/20 border border-secondary-500/30 text-secondary-600 dark:text-secondary-400 flex items-center justify-center shrink-0">
                <Building2 size={32} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                    {PARTNER_TYPE_LABELS[institution?.partner_type] || "Higher Institute (IPES)"}
                  </span>
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
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-3">
                  {institution?.name}
                  <button
                    onClick={() => {
                      setEditName(institution?.name || "");
                      setEditCity(institution?.city || "");
                      setEditCampus(institution?.campus || "");
                      setEditWhatsapp(institution?.whatsapp_number || "");
                      setEditWebsite(institution?.website_url || "");
                      setEditError("");
                      setShowEditModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-secondary-600 dark:text-secondary-400 hover:text-secondary-500 dark:text-secondary-300 border border-secondary-500/25 hover:border-secondary-500 bg-secondary-500/10 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
                  >
                    Edit Profile
                  </button>
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-secondary-600 dark:text-secondary-400" />
                    {institution?.city || "Cameroon"} (
                    {institution?.campus || "Main Campus"})
                  </span>
                  {institution?.whatsapp_number && (
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-secondary-600 dark:text-secondary-400" />+
                      {institution.whatsapp_number}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              to="/partner/programs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-bold font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-secondary-500/25 shrink-0"
            >
              <PlusCircle size={18} />
              Add / Manage Programs
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Listed Programs
              </span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {programsCount}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-950/40 text-secondary-800 dark:text-secondary-300 flex items-center justify-center font-bold">
              <BookOpen size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
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

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                WhatsApp Leads
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Direct Contact
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
              <Phone size={24} />
            </div>
          </div>
        </div>

        {/* Subscription Upgrades */}
        {(!institution?.subscription_tier || institution?.subscription_tier === "STARTER") && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-primary-600 dark:text-secondary-400 block mb-1">
                  Flexible Partner Pricing
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Upgrade Your Organization Plan
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  Choose a flexible cohort pass for seasonal bootcamps, or an institutional annual plan for year-round university degrees.
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                Current: <span className="text-primary-600 dark:text-secondary-400">Free Starter (Up to 3 listings)</span>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Flexible Cohort Pass (1, 3, or 6 Months) */}
              <div className="rounded-2xl p-6 border-2 border-primary-500/20 bg-primary-50/30 dark:bg-slate-950 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
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

                  <div className="space-y-2 mb-6">
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
                            className="p-2.5 rounded-xl border border-primary-200 dark:border-primary-800/80 bg-white dark:bg-slate-900 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-600 transition-all text-center cursor-pointer group"
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

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
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
              <div className="rounded-2xl p-6 border-2 border-secondary-500/30 bg-secondary-50/30 dark:bg-slate-950 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary-500 text-slate-950">
                    Annual
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-950/60 text-secondary-800 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800">
                      Universities & IPES
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Annual Institutional
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
                    Full 12-month platform presence for private universities, polytechnics, and academic faculties.
                  </p>

                  <div className="mb-6">
                    <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {user?.email === "sangwajesly82@gmail.com" ? "200" : "150,000"}{" "}
                      <span className="text-xs font-bold text-slate-400">XAF / Year</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">365-day verified placement</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
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
                  onClick={() =>
                    handleUpgrade(
                      user?.email === "sangwajesly82@gmail.com" ? 200 : 150000,
                      "Annual Institutional",
                      "12 Months"
                    )
                  }
                  className="w-full py-3 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-secondary-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  Get Annual Institutional
                </button>
              </div>

              {/* Option 3: Featured Partner Pass (Top Priority) */}
              <div className="rounded-2xl p-6 border border-slate-800 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-500/20 text-secondary-400 border border-secondary-500/30">
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

                  <div className="mb-6">
                    <div className="text-2xl font-black text-white tracking-tight">
                      {user?.email === "sangwajesly82@gmail.com" ? "300" : "350,000"}{" "}
                      <span className="text-xs font-bold text-slate-400">XAF / Year</span>
                    </div>
                    <span className="text-[11px] text-secondary-400 block mt-0.5">Top rank across all filters</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
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
                  onClick={() =>
                    handleUpgrade(
                      user?.email === "sangwajesly82@gmail.com" ? 300 : 350000,
                      "Featured Priority",
                      "12 Months"
                    )
                  }
                  className="w-full py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  Get Featured Priority
                </button>
              </div>
            </div>
          </div>
        )}

        {institution?.subscription_tier === "PRO" && (
          <div className="bg-gradient-to-r from-secondary-500/10 to-primary-500/10 rounded-3xl p-6 sm:p-8 border border-secondary-200 dark:border-secondary-800/50 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-700 dark:text-secondary-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Active: PRO Portal
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Boost Your Visibility to FEATURED</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pin your university to the top of student searches and orientation recommendations to maximize direct WhatsApp admissions leads.
              </p>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={() => handleUpgrade(user?.email === "sangwajesly82@gmail.com" ? 200 : 350000, "FEATURED")}
                className="w-full sm:w-auto px-6 py-3.5 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-bold font-bold text-sm rounded-xl shadow-md shadow-secondary-500/25 hover:shadow-secondary-500/35 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
              >
                {user?.email === "sangwajesly82@gmail.com" ? "Test FEATURED (200 XAF)" : "Get FEATURED (350k XAF)"}
              </button>
            </div>
          </div>
        )}

        {institution?.subscription_tier === "FEATURED" && (
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-500/20 border border-secondary-500/30 text-secondary-600 dark:text-secondary-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Featured Partner Active
              </div>
              <h2 className="text-lg font-bold text-white mb-1">Max Level Portal Active</h2>
              <p className="text-sm text-slate-400">
                Your university has maximum priority ranking and is actively recommended to students matching your courses.
              </p>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-xs font-bold shrink-0">
              Priority Ranking Enabled
            </div>
          </div>
        )}

        {/* Management Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-xs mb-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Portal Management Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/partner/programs"
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-secondary-50 dark:bg-secondary-950/30/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-secondary-200 dark:border-secondary-800 transition-all flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-secondary-700 dark:text-secondary-400 transition-colors flex items-center justify-between">
                  Manage Academic Courses
                  <ArrowRight size={16} />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Add new Bachelor's, HNDs, or Master's programs with tuition
                  fees, prerequisites, and campus locations.
                </p>
              </div>
            </Link>

            <Link
              to={`/universities`}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-primary-50/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-primary-200 transition-all flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-between">
                  View Public Directory Listing
                  <Globe size={16} />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  See how students view your university campus and courses in
                  the main Klarify Directory.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Custom Direct Payment Modal Overlay */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left">
              {/* Background accent */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              {paymentStep !== "processing" && paymentStep !== "success" && (
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}

              {/* Modal Body: INPUT state */}
              {paymentStep === "input" && (
                <form onSubmit={processDirectPayment} className="space-y-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-secondary-600 dark:text-secondary-400">Upgrade Portal</span>
                    <h3 className="text-xl font-extrabold text-white mt-1">
                      {selectedPlan.name} {selectedPlan.duration ? `(${selectedPlan.duration})` : "Plan"}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Unlock full orientation analytics, priority ranking, and direct WhatsApp student leads.
                    </p>
                  </div>

                  {/* Pricing info badge */}
                  <div className="bg-white/5 dark:bg-slate-900/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Total Price</span>
                      <span className="block text-xl font-black text-white mt-0.5">
                        {selectedPlan.amount.toLocaleString()} XAF
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-xs font-bold border border-secondary-500/30">
                      {selectedPlan.duration ? `${selectedPlan.duration} Access` : "One-time charge"}
                    </div>
                  </div>

                  {/* Custom direct payment inputs */}
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
                        className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900/5 border border-white/10 focus:border-secondary-500 rounded-xl text-white text-sm focus:outline-none transition-all"
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
                          className="w-full pl-4 pr-16 py-3 bg-white/5 dark:bg-slate-900/5 border border-white/10 focus:border-secondary-500 rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500 dark:text-slate-400"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 pointer-events-none select-none">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">MoMo</span>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-secondary-500/20 text-secondary-600 dark:text-secondary-400 border border-secondary-500/30">OM</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
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
                    className="w-full py-4 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-bold font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-secondary-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                  >
                    <CreditCard size={18} />
                    Pay {selectedPlan.amount.toLocaleString()} XAF
                  </button>
                </form>
              )}

              {/* Modal Body: PROCESSING state */}
              {paymentStep === "processing" && (
                <div className="py-8 text-center space-y-6">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <Loader2 className="animate-spin text-secondary-600 dark:text-secondary-400 absolute" size={56} />
                    <div className="w-10 h-10 rounded-full bg-secondary-500/10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Payment Request Sent</h3>
                    <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                      We have sent an authorization prompt to <strong className="text-white">{payerPhone}</strong>. Please check your screen, enter your Mobile Money PIN, and confirm.
                    </p>
                  </div>
                  <div className="bg-white/5 dark:bg-slate-900/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    <span className="text-[10px] font-black text-secondary-600 dark:text-secondary-400 uppercase block mb-1">Status</span>
                    Waiting for your handset authorization...
                  </div>
                </div>
              )}

              {/* Modal Body: SUCCESS state */}
              {paymentStep === "success" && (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 text-green-400 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Upgrade Successful!</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                      Thank you! Your transaction completed successfully. We are upgrading your dashboard to <span className="text-secondary-600 dark:text-secondary-400 font-bold">{selectedPlan.name}</span>...
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Body: FAILED state */}
              {paymentStep === "failed" && (
                <div className="py-6 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center">
                    <AlertCircle size={36} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Payment Failed</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
                      {paymentError || "The transaction could not be processed. Please try again."}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 py-3 bg-white/5 dark:bg-slate-900/5 border border-white/10 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setPaymentStep("input");
                        setPaymentError("");
                      }}
                      className="flex-1 py-3 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-bold font-bold text-sm rounded-xl transition-all shadow-md shadow-secondary-500/25 cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Edit Profile Modal Overlay */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left">
              {/* Background accent */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              {!editLoading && (
                <button
                  onClick={() => setShowEditModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-secondary-600 dark:text-secondary-400">Settings</span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    Edit Portal Profile
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Update your official institution details displayed on Klarify.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      placeholder="e.g. Saint Jerome University"
                      className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900/5 border border-white/10 focus:border-secondary-500 rounded-xl text-white text-sm focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        required
                        placeholder="e.g. Douala"
                        className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900/5 border border-white/10 focus:border-secondary-500 rounded-xl text-white text-sm focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Campus Name
                      </label>
                      <input
                        type="text"
                        value={editCampus}
                        onChange={(e) => setEditCampus(e.target.value)}
                        placeholder="e.g. Main Campus"
                        className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900/5 border border-white/10 focus:border-secondary-500 rounded-xl text-white text-sm focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      WhatsApp Contact (without +/country code)
                    </label>
                    <input
                      type="tel"
                      value={editWhatsapp}
                      onChange={(e) => setEditWhatsapp(e.target.value)}
                      required
                      placeholder="e.g. 67xxxxxxx"
                      className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900/5 border border-white/10 focus:border-secondary-500 rounded-xl text-white text-sm focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Official Website URL
                    </label>
                    <input
                      type="url"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      placeholder="https://example.cm"
                      className="w-full px-4 py-3 bg-white/5 dark:bg-slate-900/5 border border-white/10 focus:border-secondary-500 rounded-xl text-white text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {editError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={editLoading}
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 bg-white/5 dark:bg-slate-900/5 border border-white/10 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-3 bg-secondary-500 hover:bg-secondary-400 text-slate-950 font-bold font-bold text-sm rounded-xl transition-all shadow-md shadow-secondary-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {editLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
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

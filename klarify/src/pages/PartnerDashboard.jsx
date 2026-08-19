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

  const handleUpgrade = (amount, planName) => {
    setSelectedPlan({ amount, name: planName });
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

    try {
      const resp = await initiateDirectPayment({
        institutionId: institution.id,
        amount: selectedPlan.amount,
        phone: payerPhone.trim(),
        name: payerName,
        email: user?.email,
        description: `Upgrade to ${selectedPlan.name} Plan`,
      });

      if (resp.success && resp.provider_reference) {
        setActiveTransId(resp.provider_reference);
        startPaymentStatusPolling(resp.provider_reference);
      } else {
        throw new Error("Failed to initiate direct payment prompt.");
      }
    } catch (err) {
      console.error("Direct payment initiation error:", err);
      setPaymentError(
        err.response?.data?.detail ||
          err.message ||
          "Payment failed. Please confirm the number is active and try again."
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-orange-400 hover:text-orange-300 border border-orange-500/25 hover:border-orange-500 bg-orange-500/10 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
                  >
                    Edit Profile
                  </button>
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
                className="px-5 py-3 bg-white border border-orange-300 text-orange-600 font-bold text-sm rounded-xl hover:bg-orange-50 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
              >
                Upgrade to PRO (150k XAF)
              </button>
              <button
                onClick={() => handleUpgrade(350000, "FEATURED")}
                className="px-5 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 duration-200"
              >
                Get FEATURED (350k XAF)
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

        {/* Custom Direct Payment Modal Overlay */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left">
              {/* Background accent */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

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
                    <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400">Upgrade Portal</span>
                    <h3 className="text-xl font-extrabold text-white mt-1">
                      Upgrade to {selectedPlan.name} Plan
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Unlock full orientation analytics, priority ranking, and direct WhatsApp student leads.
                    </p>
                  </div>

                  {/* Pricing info badge */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Total Price</span>
                      <span className="block text-xl font-black text-white mt-0.5">
                        {selectedPlan.amount.toLocaleString()} XAF
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                      One-time charge
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500 rounded-xl text-white text-sm focus:outline-none transition-all"
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
                          className="w-full pl-4 pr-16 py-3 bg-white/5 border border-white/10 focus:border-orange-500 rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 pointer-events-none select-none">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">MoMo</span>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">OM</span>
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
                    className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
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
                    <Loader2 className="animate-spin text-orange-500 absolute" size={56} />
                    <div className="w-10 h-10 rounded-full bg-orange-500/10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Payment Request Sent</h3>
                    <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                      We have sent an authorization prompt to <strong className="text-white">{payerPhone}</strong>. Please check your screen, enter your Mobile Money PIN, and confirm.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    <span className="text-[10px] font-black text-orange-400 uppercase block mb-1">Status</span>
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
                      Thank you! Your transaction completed successfully. We are upgrading your dashboard to <span className="text-orange-400 font-bold">{selectedPlan.name}</span>...
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
                      className="flex-1 py-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setPaymentStep("input");
                        setPaymentError("");
                      }}
                      className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-500/25 cursor-pointer"
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
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

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
                  <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400">Settings</span>
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500 rounded-xl text-white text-sm focus:outline-none transition-all"
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500 rounded-xl text-white text-sm focus:outline-none transition-all"
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500 rounded-xl text-white text-sm focus:outline-none transition-all"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500 rounded-xl text-white text-sm focus:outline-none transition-all"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-orange-500 rounded-xl text-white text-sm focus:outline-none transition-all"
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
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-orange-500/25 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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

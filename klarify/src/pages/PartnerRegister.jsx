import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  MapPin,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";
import { trackEvent } from "../utils/analytics";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { registerPartnerAccount } from "../services/api";
import { useAuth } from "../context/AuthContext";

const PartnerRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user && user.user_metadata?.user_type === "INSTITUTION_ADMIN") {
      navigate("/partner/dashboard");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    institutionName: "",
    city: "Douala",
    campus: "",
    whatsappNumber: "237",
    websiteUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.institutionName ||
      !formData.whatsappNumber
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    trackEvent("partner_register_start", {
      institution: formData.institutionName || null,
    });
    setLoading(true);
    try {
      await registerPartnerAccount(formData);
      trackEvent("partner_register_complete", {
        institution: formData.institutionName || null,
      });
      // Success: navigate to partner dashboard
      navigate("/partner/dashboard", { state: { justRegistered: true } });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Partner University Sign-Up | Klarify"
        description="Register your private university campus on Klarify to list degree programs and receive admissions inquiries."
      />

      <main className="py-8 pb-20 max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto mb-3 font-bold">
            <Building2 size={24} />
          </div>
          {/* Onboarding checklist indicator */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {(() => {
              const step1 =
                formData.fullName && formData.email && formData.password;
              const step2 = formData.institutionName && formData.whatsappNumber;
              const step3 = false; // Programs upload step (later)
              return (
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div
                    className={`px-3 py-1 rounded-full ${step1 ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    Account{" "}
                    {step1 && <Check size={12} className="inline-block ml-2" />}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full ${step2 ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    Institution{" "}
                    {step2 && <Check size={12} className="inline-block ml-2" />}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full ${step3 ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    Programs
                  </div>
                </div>
              );
            })()}
          </div>
          <span className="section-eyebrow block mb-2">Partner Onboarding</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Register Your Private University
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2">
            Create an institution portal account to list your degree & HND
            programs.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Admin Representative Section */}
            <div className="pb-3 border-b border-slate-100 space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Registrar / Admin Details
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Bernard Mbeng"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admissions@university.cm"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Institution Profile Section */}
            <div className="space-y-4 pt-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Campus & Institution Profile
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University / Institution Name *
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="e.g. Higher Institute of Management & Tech (HIBMAT)"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Region *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Buea">Buea</option>
                    <option value="Bamenda">Bamenda</option>
                    <option value="Dschang">Dschang</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Kribi">Kribi</option>
                    <option value="Garoua">Garoua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Location
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="text"
                      name="campus"
                      value={formData.campus}
                      onChange={handleChange}
                      placeholder="e.g. Molyko / Akwa Campus"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Admissions Contact Number *
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="2376XXXXXXXX"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Students will use this number to send direct WhatsApp
                  inquiries for your courses.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Website (Optional)
                </label>
                <div className="relative">
                  <Globe
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://www.youruniversity.cm"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Complete Registration & Launch Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link
              to="/partner/login"
              className="text-orange-500 hover:text-orange-600 font-bold hover:underline transition-colors"
            >
              Sign in to your portal
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PartnerRegister;

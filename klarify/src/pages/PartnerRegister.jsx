import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  Laptop,
  Wrench,
  Briefcase,
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  MapPin,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { trackEvent } from "../utils/analytics";
import Layout from "../components/Layout";
import SEOHead from "../components/SEOHead";
import { registerPartnerAccount } from "../services/api";
import { useAuth } from "../context/AuthContext";

const PARTNER_TYPES = [
  {
    id: "UNIVERSITY",
    dbType: "PRIVATE_IPES",
    icon: GraduationCap,
    title: "University / Higher Institute (IPES)",
    subtitle: "List bachelor's degrees, HNDs, masters, and campus concours",
    badge: "Higher Education",
  },
  {
    id: "TECH_ACADEMY",
    dbType: "TECH_ACADEMY",
    icon: Laptop,
    title: "Tech Academy & Bootcamp",
    subtitle: "List coding bootcamps, data academies, digital design cohorts, and certificates",
    badge: "Tech & Software",
  },
  {
    id: "VOCATIONAL_HUB",
    dbType: "VOCATIONAL_CENTER",
    icon: Wrench,
    title: "Vocational & Professional Training Center",
    subtitle: "List TVEE diplomas (CQP/DQP), technical trades, and hands-on apprenticeships",
    badge: "Vocational Trades",
  },
  {
    id: "EMPLOYER",
    dbType: "COMPANY_EMPLOYER",
    icon: Briefcase,
    title: "Company & Hiring Partner",
    subtitle: "Post physical Cameroon internships and global remote contracts",
    badge: "Jobs & Internships",
  },
];

const PartnerRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user && user.user_metadata?.user_type === "INSTITUTION_ADMIN") {
      navigate("/partner/dashboard");
    }
  }, [user, navigate]);

  const [step, setStep] = useState(1); // 1: Choose Partner Type, 2: Organization & Admin Account
  const [partnerType, setPartnerType] = useState("UNIVERSITY");

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

  const selectedTypeObj = PARTNER_TYPES.find((t) => t.id === partnerType) || PARTNER_TYPES[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      partner_type: partnerType,
      institution: formData.institutionName || null,
    });
    setLoading(true);
    try {
      await registerPartnerAccount({
        ...formData,
        partnerType: selectedTypeObj.dbType,
      });
      trackEvent("partner_register_complete", {
        partner_type: partnerType,
        institution: formData.institutionName || null,
      });
      // Success: navigate to partner dashboard
      navigate("/partner/dashboard", { state: { justRegistered: true, partnerType } });
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
        title="Partner Network Onboarding | Klarify"
        description="Register your university, tech academy, vocational training center, or hiring company on Klarify."
      />

      <main className="py-8 pb-20 max-w-2xl mx-auto px-4">
        {/* Onboarding Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-3 font-bold">
            <Building2 size={24} />
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                step === 1
                  ? "bg-primary-500 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
              }`}
            >
              1. Organization Type {step > 1 && <Check size={12} className="inline-block ml-1" />}
            </div>
            <div
              className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                step === 2
                  ? "bg-primary-500 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              2. Details & Setup
            </div>
          </div>

          <span className="section-eyebrow block mb-2">Partner Onboarding</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {step === 1 ? "Select Your Organization Type" : `Register Your ${selectedTypeObj.badge}`}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
            {step === 1
              ? "Choose how you want to partner with Klarify to connect with students, trainees, and job seekers."
              : "Set up your admin account to list your programs, cohorts, and opportunities on Klarify."}
          </p>
        </div>

        {/* STEP 1: Select Partner Type */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3.5">
              {PARTNER_TYPES.map((type) => {
                const IconComponent = type.icon;
                const isSelected = partnerType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setPartnerType(type.id)}
                    className={`p-5 rounded-[1.75rem] border transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                      isSelected
                        ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 shadow-xs ring-1 ring-primary-500"
                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary-500 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <IconComponent size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                          {type.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {type.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {type.subtitle}
                      </p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-primary-500 text-white shadow-xs"
                          : "border-2 border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M1.5 5L4 7.5L8.5 2.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full transition-all shadow-md cursor-pointer"
              >
                <span>Continue to Organization Setup</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Profile & Account Details */}
        {step === 2 && (
          <div className="bg-white dark:bg-[#0F1626] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-300 text-xs font-bold border border-primary-200/50">
                  {selectedTypeObj.badge}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {selectedTypeObj.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Change Type</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Admin Representative Section */}
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Official Representative Details
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                      placeholder="e.g. Dr. Bernard Mbeng or Sandra Tabi"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Work Email *
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
                      placeholder="contact@organization.cm"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Portal Password *
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Organization Profile Section */}
              <div className="space-y-4 pt-1">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  2. Organization Profile
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {partnerType === "UNIVERSITY"
                      ? "University / Institution Name *"
                      : partnerType === "TECH_ACADEMY"
                        ? "Tech Academy / Bootcamp Name *"
                        : partnerType === "VOCATIONAL_HUB"
                          ? "Vocational Center / Trade School Name *"
                          : "Company / Employer Name *"}
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
                      placeholder={
                        partnerType === "UNIVERSITY"
                          ? "e.g. Higher Institute of Management & Tech"
                          : partnerType === "TECH_ACADEMY"
                            ? "e.g. Seven Advanced Academy"
                            : partnerType === "VOCATIONAL_HUB"
                              ? "e.g. Douala Vocational & Trade Center"
                              : "e.g. Activa Tech Labs"
                      }
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primary City / Region *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                    >
                      <option value="Douala">Douala</option>
                      <option value="Yaoundé">Yaoundé</option>
                      <option value="Buea">Buea</option>
                      <option value="Bamenda">Bamenda</option>
                      <option value="Dschang">Dschang</option>
                      <option value="Bafoussam">Bafoussam</option>
                      <option value="Kribi">Kribi</option>
                      <option value="Garoua">Garoua</option>
                      <option value="Limbe">Limbe</option>
                      <option value="Remote / Online">Remote / Nationwide Online</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Campus / Facility Location
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
                        placeholder="e.g. Akwa / Molyko or Remote"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Admissions / Inquiries Contact *
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Interested candidates and trainees will reach this number directly on WhatsApp.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Website or Portfolio (Optional)
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
                      placeholder="https://www.organization.cm"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-md shadow-primary-500/25 flex items-center justify-center gap-2 cursor-pointer"
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
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              Already registered?{" "}
              <Link
                to="/partner/login"
                className="text-primary-600 dark:text-primary-400 font-bold hover:underline transition-colors"
              >
                Sign in to your portal
              </Link>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default PartnerRegister;

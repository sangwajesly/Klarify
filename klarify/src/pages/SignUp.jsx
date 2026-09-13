import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const isPhone = (value) => /^[+\d]/.test(value.trim()) && !value.includes("@");

const normalizePhone = (value) => {
  const digits = value.replace(/\s|-/g, "").trim();
  if (digits.startsWith("+")) return digits;
  return "+237" + digits.replace(/^0+/, "");
};

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, signUpWithPhone, user } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");

  const usingPhone = isPhone(formData.identifier);

  React.useEffect(() => {
    if (user) navigate("/flow");
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError(t("auth.signUp.errors.fullName"));
      return false;
    }
    if (!formData.identifier.trim()) {
      setError(t("auth.errors.enterIdentifier"));
      return false;
    }
    if (usingPhone) {
      const digits = formData.identifier.replace(/\D/g, "");
      if (digits.length < 9) {
        setError(t("auth.errors.invalidPhone"));
        return false;
      }
    } else {
      if (!formData.identifier.includes("@")) {
        setError(t("auth.errors.invalidEmail"));
        return false;
      }
    }
    if (formData.password.length < 6) {
      setError(t("auth.signUp.errors.passwordLength"));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.signUp.errors.passwordMatch"));
      return false;
    }
    if (!agreeToTerms) {
      setError(t("auth.signUp.errors.agreeTerms"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (usingPhone) {
        const phone = normalizePhone(formData.identifier);
        const { session } = await signUpWithPhone(
          phone,
          formData.password,
          formData.fullName,
        );
        if (session) {
          navigate("/flow");
        } else {
          setError(t("auth.signUp.messages.accountCreated"));
        }
      } else {
        const { session } = await signUp(
          formData.identifier,
          formData.password,
          formData.fullName,
        );
        if (session) {
          navigate("/flow");
        } else {
          // Supabase sent a confirmation email — show the check-your-email screen
          setConfirmedEmail(formData.identifier);
          setConfirmationSent(true);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          t("auth.errors.loginFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    let s = 0;
    if (formData.password.length >= 6) s++;
    if (/[A-Z]/.test(formData.password)) s++;
    if (/[0-9]/.test(formData.password)) s++;
    if (/[^A-Za-z0-9]/.test(formData.password)) s++;
    return s;
  };

  // ── Email confirmation sent screen ──────────────────────────────────────────
  if (confirmationSent) {
    return (
      <Layout noPadding={true} hideFooter={true}>
        <div className="w-full h-[calc(100vh-3.5rem)] bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/50 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 w-full max-w-sm text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-orange-500 flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Mail size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              {t("auth.signUp.confirmEmail.heading")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-2">
              {t("auth.signUp.confirmEmail.sentTo")}
            </p>
            <p className="text-orange-500 font-bold text-sm mb-6 break-all">
              {confirmedEmail}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
              {t("auth.signUp.confirmEmail.instruction")}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-4 rounded-2xl transition-colors duration-200"
            >
              {t("auth.signUp.confirmEmail.goToSignIn")}{" "}
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => {
                setConfirmationSent(false);
                setError("");
              }}
              className="mt-6 text-slate-500 dark:text-slate-400 font-bold hover:text-orange-500 text-xs transition-colors w-full"
            >
              {t("auth.signUp.confirmEmail.useDifferent")}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout noPadding={true} hideFooter={true}>
      <div className="w-full flex h-[calc(100vh-3.5rem)] overflow-hidden">
        
        {/* ── Left Side (Branding/Visual) ── */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/20 via-slate-900 to-slate-900 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center font-bold text-xl mb-4 shadow-sm text-white">
              K
            </div>
            <span className="font-bold text-xl tracking-tight">Klarify</span>
          </div>

          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              Start your journey with us.
            </h2>
            <p className="text-slate-400 text-lg">
              Create an account to save programs, track your progress, and get personalized recommendations based on your unique profile.
            </p>
          </div>
        </div>

        {/* ── Right Side (Form) ── */}
        <div className="w-full lg:w-1/2 bg-slate-50 dark:bg-slate-950 relative overflow-y-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/50 via-transparent to-transparent pointer-events-none" />

          <div className="min-h-full grid px-6 py-12">
            <div className="relative z-10 w-full max-w-sm m-auto">
            {/* Header */}
            <div className="flex flex-col items-center lg:items-start mb-8 text-center lg:text-left">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-xl mb-4 border border-orange-100 lg:hidden">
                K
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight lg:text-4xl">
                {t("auth.signUp.createAccount") || "Create an account"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                {t("auth.signUp.joinCommunity")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-red-600 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  {t("auth.signUp.nameLabel")}
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t("auth.signUp.namePlaceholder")}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  {t("auth.identifierLabel")}
                </label>
                <div className="relative">
                  {usingPhone ? (
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                      size={18}
                      aria-hidden="true"
                    />
                  ) : (
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder={t("auth.identifierPlaceholder")}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
                {usingPhone && (
                  <p className="text-xs text-orange-500 font-medium mt-2 flex items-center gap-1.5">
                    <Phone size={14} /> {t("auth.signUp.phoneNote")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  {t("auth.passwordLabel")}
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-11 py-3.5 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-3 flex gap-1.5">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${i < passwordStrength() ? "bg-orange-500" : "bg-slate-100 dark:bg-slate-800"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  {t("auth.signUp.confirmPassword")}
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-11 py-3.5 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer py-2 group">
                <span className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="w-5 h-5 rounded-md border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white hidden peer-checked:block"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M1.5 5L4 7.5L8.5 2.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed group-hover:text-slate-700 dark:text-slate-300 transition-colors">
                  {t("auth.signUp.agreeToTerms")}{" "}
                  <Link
                    to="/terms"
                    className="text-orange-500 font-bold hover:text-orange-400 transition-colors"
                  >
                    {t("auth.termsLabel")}
                  </Link>{" "}
                  {t("auth.and")}{" "}
                  <Link
                    to="/privacy"
                    className="text-orange-500 font-bold hover:text-orange-400 transition-colors"
                  >
                    {t("auth.privacyLabel")}
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm py-4 rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {usingPhone
                      ? t("auth.signUp.sendingCode")
                      : t("auth.signUp.creating")}
                  </span>
                ) : (
                  <>
                    {usingPhone
                      ? t("auth.signUp.sendVerificationCode")
                      : t("auth.createAccount")}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {t("auth.signUp.alreadyHaveAccount")}
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            <Link
              to="/login"
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:text-white hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 font-bold text-sm py-4 rounded-2xl transition-all duration-200 flex items-center justify-center"
            >
              {t("auth.signIn")}
            </Link>
          </div>

          <p className="text-center text-slate-500 dark:text-slate-400 font-medium text-xs mt-6">
            {t("auth.signUp.readyText")}{" "}
            <span className="text-slate-900 dark:text-white font-bold">
              {t("auth.signUp.readyAction")}
            </span>
          </p>
        </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default SignUp;

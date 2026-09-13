import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const isPhone = (value) => /^[+\d]/.test(value.trim()) && !value.includes("@");

const normalizePhone = (value) => {
  const digits = value.replace(/\s|-/g, "").trim();
  if (digits.startsWith("+")) return digits;
  return "+237" + digits.replace(/^0+/, "");
};

const PartnerLogin = () => {
  const navigate = useNavigate();
  const { signIn, signInWithPhone, user, signOut } = useAuth();
  const { t } = useLanguage();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const usingPhone = isPhone(identifier);

  React.useEffect(() => {
    if (user && user.user_metadata?.user_type === "INSTITUTION_ADMIN") {
      navigate("/partner/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError(t("auth.errors.enterIdentifier"));
      return;
    }
    if (usingPhone) {
      const digits = identifier.replace(/\D/g, "");
      if (digits.length < 9) {
        setError(t("auth.errors.invalidPhone"));
        return;
      }
    } else if (!identifier.includes("@")) {
      setError(t("auth.errors.invalidEmail"));
      return;
    }
    if (!password) {
      setError(t("auth.errors.enterPassword"));
      return;
    }

    setLoading(true);
    try {
      let data;
      if (usingPhone) {
        const phone = normalizePhone(identifier);
        data = await signInWithPhone(phone, password);
      } else {
        data = await signIn(identifier, password);
      }

      if (data?.user?.user_metadata?.user_type !== "INSTITUTION_ADMIN") {
        setError(t("partnerAuth.accessDenied"));
        await signOut();
      } else {
        navigate("/partner/dashboard");
      }
    } catch (err) {
      const msg = err.message || "";
      setError(msg || t("auth.errors.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout noPadding={true} hideFooter={true}>
      <div className="w-full flex h-[calc(100vh-3.5rem)] overflow-hidden">
        
        {/* ── Left Side (Branding/Visual) ── */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-orange-500/20 via-slate-900 to-slate-900 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center font-bold text-xl mb-4 shadow-sm text-white">
              K
            </div>
            <span className="font-bold text-xl tracking-tight">Klarify Partner</span>
          </div>

          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              Manage your institution.
            </h2>
            <p className="text-slate-400 text-lg">
              Reach thousands of prospective students and manage your program listings effortlessly.
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
                {t("partnerAuth.title")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                {t("partnerAuth.subtitle")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-red-600 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  {t("auth.identifierLabel")}
                </label>
                <div className="relative">
                  {usingPhone ? (
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                      size={18}
                    />
                  ) : (
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                  )}
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t("auth.identifierPlaceholder")}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  {t("auth.passwordLabel")}
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-11 py-3.5 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors"
                    aria-label={
                      showPassword
                        ? t("auth.showPasswordHide")
                        : t("auth.showPasswordShow")
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm py-4 rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2 mt-4"
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
                    {t("auth.signingIn")}
                  </span>
                ) : (
                  <>
                    {t("auth.signIn")} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {t("partnerAuth.needAccount")}
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            <Link
              to="/partner/register"
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:text-white hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950 font-bold text-sm py-4 rounded-2xl transition-all duration-200 flex items-center justify-center"
            >
              {t("partnerAuth.createAccount")}
            </Link>
          </div>

          <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-6">
            {t("partnerAuth.agreePrefix")}{" "}
            <Link
              to="/terms"
              className="text-slate-700 dark:text-slate-300 font-bold hover:text-orange-500 transition-colors"
            >
              {t("auth.termsLabel")}
            </Link>{" "}
            {t("auth.and")}{" "}
            <Link
              to="/privacy"
              className="text-slate-700 dark:text-slate-300 font-bold hover:text-orange-500 transition-colors"
            >
              {t("auth.privacyLabel")}
            </Link>
          </p>
        </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default PartnerLogin;

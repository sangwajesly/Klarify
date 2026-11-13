import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import heroVisual from "../assets/pexels-the-artboard-131151099-18346466.jpg";

const isPhone = (value) => /^[+\d]/.test(value.trim()) && !value.includes("@");

const normalizePhone = (value) => {
  const digits = value.replace(/\s|-/g, "").trim();
  if (digits.startsWith("+")) return digits;
  return "+237" + digits.replace(/^0+/, "");
};

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithPhone, signInWithOAuthProvider, user } = useAuth();
  const { t } = useLanguage();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // "google" | "linkedin" | null
  const [error, setError] = useState("");

  const usingPhone = isPhone(identifier);

  React.useEffect(() => {
    if (user) {
      if (user.user_metadata?.user_type === "INSTITUTION_ADMIN") {
        navigate("/partner/dashboard");
      } else {
        navigate("/flow");
      }
    }
  }, [user, navigate]);

  const handleSocialSignIn = async (provider) => {
    setError("");
    setSocialLoading(provider);
    try {
      if (provider === "linkedin") {
        try {
          await signInWithOAuthProvider("linkedin_oidc");
          return;
        } catch (oidcErr) {
          console.warn("linkedin_oidc error, trying legacy linkedin provider:", oidcErr);
          await signInWithOAuthProvider("linkedin");
          return;
        }
      } else {
        await signInWithOAuthProvider(provider);
      }
    } catch (err) {
      console.error(`${provider} OAuth error:`, err);
      setError(
        err.message || `Failed to sign in with ${provider}. Please verify provider settings in Supabase.`
      );
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError(t("auth.errors.enterIdentifier") || "Please enter your email or phone number.");
      return;
    }
    if (usingPhone) {
      const digits = identifier.replace(/\D/g, "");
      if (digits.length < 9) {
        setError(t("auth.errors.invalidPhone") || "Please enter a valid phone number.");
        return;
      }
    } else if (!identifier.includes("@")) {
      setError(t("auth.errors.invalidEmail") || "Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError(t("auth.errors.enterPassword") || "Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      let loginData;
      if (usingPhone) {
        const phone = normalizePhone(identifier);
        loginData = await signInWithPhone(phone, password);
      } else {
        loginData = await signIn(identifier, password);
      }

      const loggedUser = loginData?.user;
      if (loggedUser?.user_metadata?.user_type === "INSTITUTION_ADMIN") {
        navigate("/partner/dashboard");
      } else {
        navigate("/flow");
      }
    } catch (err) {
      const msg = err.message || "";
      if (
        usingPhone &&
        (msg.includes("Invalid login") || msg.includes("invalid_credentials"))
      ) {
        setError(t("auth.errors.noAccount") || "No account found with this phone number.");
      } else {
        setError(msg || t("auth.errors.loginFailed") || "Invalid login credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout noPadding={true} hideFooter={true} hideHeader={true} fullScreen={true}>
      <div className="w-full h-screen h-[100dvh] max-h-screen flex flex-col lg:flex-row bg-white dark:bg-[#0A0E17] overflow-hidden select-none">
        
        {/* ── Left Side (ALX-Style Twilight Photographic Visual, Single Viewport Fit) ── */}
        <div className="hidden lg:flex w-1/2 h-full max-h-screen relative overflow-hidden flex-col justify-between p-8 xl:p-12">
          {/* Base Photographic Image */}
          <img
            src={heroVisual}
            alt="Students collaborating"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.75]"
          />

          {/* Dusk Twilight Palette Gradient Overlay in Primary Blue */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1026]/95 via-[#1F3B8F]/75 to-[#1E2435]/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_20%,rgba(198,212,51,0.15),transparent_70%)]" />

          {/* Top Brand Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 relative z-10 group">
            <div className="w-10 h-10 rounded-full bg-secondary-500 text-slate-950 flex items-center justify-center font-black text-base shadow-md group-hover:scale-105 transition-transform">
              K
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-xs">
              Klarify
            </span>
          </Link>

          {/* Bottom Editorial Copy */}
          <div className="relative z-10 max-w-lg mt-auto pt-6">
            <div className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold uppercase tracking-wider mb-2.5">
              Academic, Skill & Career Guidance
            </div>
            <h2 className="text-2xl xl:text-3xl font-extrabold text-white leading-tight mb-2 tracking-tight drop-shadow-sm">
              Clear paths to degrees, skills, and top careers.
            </h2>
            <p className="text-slate-200 text-xs xl:text-sm leading-relaxed max-w-sm font-normal">
              From secondary school GCE leavers to degree holders and career builders, Klarify maps your verified next step.
            </p>
          </div>
        </div>

        {/* ── Right Side (Soft, Clean Form Panel, Perfectly Centered in 1 Viewport) ── */}
        <div className="w-full lg:w-1/2 h-full max-h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-4 overflow-y-auto lg:overflow-hidden bg-white dark:bg-[#0A0E17]">
          <div className="w-full max-w-sm sm:max-w-[400px] mx-auto my-auto flex flex-col justify-center">
            
            {/* Mobile Header Brand & Back */}
            <div className="lg:hidden mb-3.5 flex items-center justify-between">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
                  K
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Klarify
                </span>
              </Link>
              <Link
                to="/"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                Back to home &rarr;
              </Link>
            </div>

            {/* Title Block */}
            <div className="mb-3.5">
              <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-secondary-400 border border-primary-100 dark:border-primary-900 mb-1.5">
                Orientation & Partner Portal
              </span>
              <h1 className="text-2xl sm:text-[1.75rem] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Continue Your Path
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
                Sign in to access your recommendations, saved courses, and dashboard.
              </p>
            </div>

            {/* ── Social Sign-In Options (Google & LinkedIn) ── */}
            <div className="relative my-2.5 sm:my-3 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-[#0A0E17] px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
                Fast sign-in with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                disabled={Boolean(socialLoading) || loading}
                className="py-2.5 px-3 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-900 flex items-center justify-center gap-2 transition-all shadow-2xs group cursor-pointer disabled:opacity-50 text-xs font-bold text-slate-700 dark:text-slate-300"
                aria-label="Continue with Google"
              >
                {socialLoading === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Google</span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => handleSocialSignIn("linkedin")}
                disabled={Boolean(socialLoading) || loading}
                className="py-2.5 px-3 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-900 flex items-center justify-center gap-2 transition-all shadow-2xs group cursor-pointer disabled:opacity-50 text-xs font-bold text-slate-700 dark:text-slate-300"
                aria-label="Continue with LinkedIn"
              >
                {socialLoading === "linkedin" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0A66C2]" />
                ) : (
                  <svg className="w-4 h-4 text-[#0A66C2] fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                )}
                <span>LinkedIn</span>
              </button>
            </div>

            {/* ── Manual Sign-In Divider ── */}
            <div className="relative my-2.5 sm:my-3 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-[#0A0E17] px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
                Or enter your email or phone
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-900/50 rounded-xl">
                <p className="text-red-600 dark:text-red-400 text-xs font-semibold text-center leading-snug">{error}</p>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              {/* Email / Phone Field */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 6xxxxxxxx or name@domain.cm"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-3.5 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-500/10 transition-all font-medium"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    {usingPhone ? <Phone size={16} /> : <Mail size={16} />}
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-3.5 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-500/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setError("Password reset link will be sent to your registered email or phone.");
                  }}
                  className="text-xs font-semibold text-primary-500 hover:text-primary-600 dark:text-primary-400 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>

              {/* Sign In Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 hover:bg-primary-600 active:scale-[0.99] disabled:bg-primary-300 disabled:cursor-not-allowed text-white font-bold py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-md shadow-primary-500/25 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Sign In to Klarify</span>
                      <ArrowRight size={15} />
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Don't have an account? Sign up */}
            <div className="text-center mt-3 sm:mt-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              New to Klarify?{" "}
              <Link
                to="/signup"
                className="font-bold text-primary-500 hover:text-primary-600 dark:text-primary-400 transition-colors ml-0.5"
              >
                Create free profile
              </Link>
            </div>

            {/* Support Help Footer */}
            <div className="text-center mt-3 sm:mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400">
                Having trouble signing in?{" "}
                <a
                  href="mailto:support@klarifypath.com"
                  className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-colors font-semibold"
                >
                  Contact Klarify Support
                </a>
              </span>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

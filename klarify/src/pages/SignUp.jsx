import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const isPhone = (value) => /^[+\d]/.test(value.trim()) && !value.includes("@");

const normalizePhone = (value) => {
  const digits = value.replace(/\s|-/g, "").trim();
  if (digits.startsWith("+")) return digits;
  return "+237" + digits.replace(/^0+/, "");
};

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, signUpWithPhone, user } = useAuth();

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
      setError("Please enter your full name."); return false;
    }
    if (!formData.identifier.trim()) {
      setError("Please enter your phone number or email."); return false;
    }
    if (usingPhone) {
      const digits = formData.identifier.replace(/\D/g, "");
      if (digits.length < 9) {
        setError("Phone number must be at least 9 digits."); return false;
      }
    } else {
      if (!formData.identifier.includes("@")) {
        setError("Please enter a valid email address."); return false;
      }
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters."); return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match."); return false;
    }
    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service."); return false;
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
        const { session } = await signUpWithPhone(phone, formData.password, formData.fullName);
        if (session) {
          navigate("/flow");
        } else {
          setError("Account created! Please sign in to continue.");
        }
      } else {
        const { session } = await signUp(
          formData.identifier,
          formData.password,
          formData.fullName
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
      setError(err.response?.data?.detail || err.message || "Sign up failed. Please try again.");
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
      <Layout noPadding={true}>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-6">
              <Mail size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Check Your Email</h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-2">
              We sent a confirmation link to:
            </p>
            <p className="text-orange-400 font-semibold text-sm mb-6 break-all">{confirmedEmail}</p>
            <p className="text-slate-500 text-xs leading-relaxed mb-8">
              Click the link in the email to activate your account, then come back to sign in. Check your spam folder if you don't see it within a minute.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200"
            >
              Go to Sign In <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => { setConfirmationSent(false); setError(""); }}
              className="mt-4 text-slate-500 hover:text-slate-300 text-xs transition-colors w-full"
            >
              Use a different email
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout noPadding={true}>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-base shadow-md mb-3">
              K
            </div>
            <h1 className="text-2xl font-bold text-white">Klarify</h1>
            <p className="text-slate-500 text-sm mt-1">Join our academic community</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-xl">
            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} aria-hidden="true" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. NKENG PRECIOUS"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Phone Number or Email
                </label>
                <div className="relative">
                  {usingPhone
                    ? <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" size={16} aria-hidden="true" />
                    : <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} aria-hidden="true" />
                  }
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="+237 6XX XXX XXX or you@example.com"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                  />
                </div>
                {usingPhone && (
                  <p className="text-xs text-orange-300 mt-1 flex items-center gap-1">
                    <Phone size={12} /> Phone sign-up is currently enabled without an SMS verification step.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} aria-hidden="true" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength() ? "bg-orange-500" : "bg-slate-800"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} aria-hidden="true" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer py-1 group">
                <span className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="w-4 h-4 rounded border border-slate-600 bg-slate-800 peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white hidden peer-checked:block" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </span>
                <span className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors">
                  I agree to the{" "}
                  <Link to="/terms" className="text-orange-400 hover:text-orange-300 transition-colors">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors">Privacy Policy</Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {usingPhone ? "Sending Code..." : "Creating Account..."}
                  </span>
                ) : (
                  <>
                    {usingPhone ? "Send Verification Code" : "Create Account"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-600 text-xs">Already have an account?</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <Link
              to="/login"
              className="w-full border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 font-semibold text-sm py-3 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>

          <p className="text-center text-slate-600 text-xs mt-5">
            Ready to clarify your academic path?{" "}
            <span className="text-slate-400">Let's get started!</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;

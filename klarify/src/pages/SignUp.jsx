import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { sendOTP } from "../services/api";

// Detect if a value looks like a phone number
const isPhone = (value) => /^[+\d]/.test(value.trim()) && !value.includes("@");

// Normalize to E.164 with Cameroon prefix
const normalizePhone = (value) => {
  const digits = value.replace(/\s|-/g, "").trim();
  if (digits.startsWith("+")) return digits;
  return "+237" + digits.replace(/^0+/, "");
};

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "", // email OR phone
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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
        // Phone signup: send OTP first, then redirect to verify page
        const phone = normalizePhone(formData.identifier);
        await sendOTP(phone, formData.fullName);
        navigate("/verify-phone", {
          state: {
            phone,
            fullName: formData.fullName,
            password: formData.password,
            mode: "signup",
          },
        });
      } else {
        // Email signup: existing Supabase flow
        const { session } = await signUp(
          formData.identifier,
          formData.password,
          formData.fullName
        );
        if (session) {
          navigate("/flow");
        } else {
          setError("Account created! Please check your email to confirm, then sign in.");
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

  return (
    <Layout noPadding={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
        {/* Background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3">
              K
            </div>
            <h1 className="text-3xl font-bold text-white">Klarify</h1>
            <p className="text-slate-400 text-sm mt-1">Join our academic community</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. NKENG PRECIOUS"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Phone or Email */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Phone Number or Email
                </label>
                <div className="relative">
                  {usingPhone
                    ? <Phone className="absolute left-3 top-3.5 text-orange-400" size={20} />
                    : <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  }
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="+237 6XX XXX XXX or you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
                {usingPhone && (
                  <p className="text-xs text-orange-300 mt-1 flex items-center gap-1">
                    <Phone size={12} /> A 6-digit verification code will be sent to this number.
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength() ? "bg-orange-500" : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border border-white/20 cursor-pointer mt-1"
                />
                <span className="text-slate-300 text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-orange-400 hover:text-orange-300 transition-colors">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors">Privacy Policy</Link>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {loading
                  ? (usingPhone ? "Sending Code..." : "Creating Account...")
                  : (usingPhone ? "Send Verification Code" : "Create Account")
                }
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-slate-400 text-sm">Already have an account?</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <Link
              to="/login"
              className="w-full border border-white/20 text-white font-semibold py-2.5 rounded-lg hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            Ready to clarify your academic path?{" "}
            <span className="text-orange-400">Let's get started!</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;

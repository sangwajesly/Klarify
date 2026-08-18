import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const isPhone = (value) => /^[+\d]/.test(value.trim()) && !value.includes("@");

const normalizePhone = (value) => {
  const digits = value.replace(/\s|-/g, "").trim();
  if (digits.startsWith("+")) return digits;
  return "+237" + digits.replace(/^0+/, "");
};

const PartnerLogin = () => {
  const navigate = useNavigate();
  const { signIn, signInWithPhone, user, signOut } = useAuth();

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
      setError("Please enter your phone number or email.");
      return;
    }
    if (usingPhone) {
      const digits = identifier.replace(/\D/g, "");
      if (digits.length < 9) {
        setError("Phone number must be at least 9 digits.");
        return;
      }
    } else if (!identifier.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
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
        setError("Access denied. Only institution accounts can access the partner portal.");
        await signOut();
      } else {
        navigate("/partner/dashboard");
      }
    } catch (err) {
      const msg = err.message || "";
      setError(msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout noPadding={true}>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative">
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
            <h1 className="text-2xl font-bold text-white">Institution Login</h1>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to manage your campus portal
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-xl">
            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Phone Number or Email
                </label>
                <div className="relative">
                  {usingPhone ? (
                    <Phone
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400"
                      size={16}
                    />
                  ) : (
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                      size={16}
                    />
                  )}
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+237 6XX XXX XXX or you@example.com"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    size={16}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-600 text-xs">Need an account?</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <Link
              to="/partner/register"
              className="w-full border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 font-semibold text-sm py-3 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              Create Partner Account
            </Link>
          </div>

          <p className="text-center text-slate-600 text-xs mt-5">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-slate-400 hover:text-slate-200">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-slate-400 hover:text-slate-200">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PartnerLogin;

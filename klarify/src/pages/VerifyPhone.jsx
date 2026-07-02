import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, ArrowRight, RefreshCw } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { sendOTP, verifyOTP } from "../services/api";

const VerifyPhone = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUpWithPhone } = useAuth();

  const { phone, fullName, password, mode } = location.state || {};

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [resending, setResending] = useState(false);

  const inputs = useRef([]);

  // Redirect if no state (direct navigation)
  useEffect(() => {
    if (!phone) navigate("/signup");
  }, [phone, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    setError("");
    // Auto-advance
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Please enter the full 6-digit code."); return;
    }

    setLoading(true);
    setError("");
    try {
      // 1. Verify OTP with backend
      await verifyOTP(phone, fullCode);

      // 2. Create Supabase account (signup mode only — login uses existing account)
      if (mode === "signup") {
        await signUpWithPhone(phone, password, fullName);
      }

      setSuccess("Phone verified! Redirecting...");
      setTimeout(() => navigate("/flow"), 1200);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Verification failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await sendOTP(phone, fullName || "");
      setResendTimer(60);
      setCode(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Layout noPadding={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
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
            <h1 className="text-3xl font-bold text-white">Verify Your Number</h1>
            <p className="text-slate-400 text-sm mt-1 text-center max-w-xs">
              We sent a 6-digit code to{" "}
              <span className="text-orange-400 font-semibold">{phone}</span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <MessageSquare size={32} className="text-orange-400" />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-200 text-sm font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* 6-digit OTP boxes */}
              <div
                className="flex justify-center gap-3 mb-8"
                onPaste={handlePaste}
              >
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border transition-all
                      ${digit
                        ? "bg-orange-500/20 border-orange-500/60 text-white"
                        : "bg-white/5 border-white/20 text-white"
                      }
                      focus:outline-none focus:border-orange-500 focus:bg-orange-500/10`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || code.join("").length < 6}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Resend */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm mb-2">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || resending}
                className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto"
              >
                <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyPhone;

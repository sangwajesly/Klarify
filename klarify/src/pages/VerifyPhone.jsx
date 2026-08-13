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

  useEffect(() => {
    if (!phone) navigate("/signup");
  }, [phone, navigate]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    setError("");
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
      await verifyOTP(phone, fullCode);

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
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
              <MessageSquare size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">Verify Your Number</h1>
            <p className="text-slate-400 text-xs mt-1 text-center max-w-xs leading-relaxed">
              We sent a 6-digit code to{" "}
              <span className="text-orange-400 font-semibold">{phone}</span>
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-xl">
            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3.5 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                className="flex justify-between gap-2 mb-7"
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
                    className={`w-11 h-13 text-center text-xl font-bold rounded-xl border transition-all
                      ${digit
                        ? "bg-slate-800/80 border-orange-500/60 text-white"
                        : "bg-slate-800/40 border-slate-700 text-white"
                      }
                      focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || code.join("").length < 6}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <>Verify & Continue <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-slate-500 text-xs mb-1.5">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || resending}
                className="text-orange-400 hover:text-orange-300 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto"
              >
                <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
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

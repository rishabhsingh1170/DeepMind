import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import { authAPI } from "../utils/apiClient";

const initialForm = {
  workEmail: "",
  otp: "",
  newPassword: "",
};

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("request"); // "request" | "verify" | "success"
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((value) => !value);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authAPI.sendForgotPasswordOTP(formData.workEmail.trim());
      setStep("verify");
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
      console.error("Forgot password send OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.newPassword.trim().length < 8) {
      setIsLoading(false);
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.otp.trim().length === 0) {
      setIsLoading(false);
      setError("Verification code is required.");
      return;
    }

    try {
      await authAPI.resetPasswordWithOTP(
        formData.workEmail.trim(),
        formData.otp.trim(),
        formData.newPassword,
      );
      setStep("success");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Enterprise Secure Access
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {step === "request" && "Forgot your password?"}
          {step === "verify" && "Verify OTP and reset password"}
          {step === "success" && "Password reset successful"}
        </h1>
        <p className="max-w-lg text-sm text-slate-500 sm:text-base">
          {step === "request" &&
            "Enter your work email. We will send an OTP to help you reset your password."}
          {step === "verify" &&
            `Enter the verification code sent to ${formData.workEmail} and choose a new password.`}
          {step === "success" &&
            "Your password has been updated. Redirecting to sign in..."}
        </p>
      </div>

      <form
        onSubmit={step === "request" ? handleSendOTP : handleResetPassword}
        className="space-y-5"
      >
        <AuthInput
          id="workEmail"
          label="Work Email"
          type="email"
          value={formData.workEmail}
          onChange={handleChange}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />

        {step === "verify" && (
          <>
            <AuthInput
              id="otp"
              label="Verification Code"
              value={formData.otp}
              onChange={handleChange}
              placeholder="000000"
              required
            />

            <AuthInput
              id="newPassword"
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              trailingAction={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="inline-flex items-center justify-center text-slate-500 transition hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          </>
        )}

        <button
          type="submit"
          disabled={isLoading || step === "success"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {step === "request" && (isLoading ? "Sending OTP..." : "Send OTP")}
          {step === "verify" &&
            (isLoading ? "Resetting password..." : "Reset password")}
          {step === "success" && "Redirecting..."}
        </button>

        {step === "verify" && (
          <button
            type="button"
            onClick={() => setStep("request")}
            className="w-full text-center text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
          >
            Back
          </button>
        )}

        {error && (
          <p className="inline-flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {step === "success" && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            Password reset complete. Taking you to sign in...
          </p>
        )}
      </form>

      {step !== "success" && (
        <p className="text-sm text-slate-500">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 transition hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}

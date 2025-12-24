import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRequestOtp } from "../hooks/useAuth";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const requestOtpMutation = useRequestOtp();

  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error("Mohon masukkan email atau nomor telepon");
      return;
    }

    try {
      const result = await requestOtpMutation.mutateAsync({ username: phone });
      console.log(result, 'result');
      if (result.success || result.status === 200) {
        toast.success("Kode OTP berhasil dikirim! Silakan cek email/SMS Anda.");
      }
      navigate("/reset-password", {
        state: { phone },
        replace: true,
      });
    } catch (error: any) {
      console.error("Request OTP failed:", error);
      toast.error(error?.message || "Gagal mengirim OTP. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-accent/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-xl mb-4 shadow-accent p-3">
            <img
              src="/lapakbenz.png"
              alt="LapakBenz Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary">Lupa Kata Sandi?</h1>
          <p className="text-gray-600 mt-2">
            Masukkan email atau nomor telepon Anda untuk menerima kode OTP
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Alert */}
          {requestOtpMutation.isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-red-800">
                {requestOtpMutation.error?.message || "Terjadi kesalahan"}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone/Email Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email atau Nomor Telepon *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="email@example.com atau 08123456789"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  disabled={requestOtpMutation.isPending}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={requestOtpMutation.isPending}
              className="w-full bg-accent text-white py-3.5 px-4 rounded-lg hover:bg-accent-hover focus:ring-4 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-accent"
            >
              {requestOtpMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Mengirim OTP...
                </span>
              ) : (
                "Kirim OTP"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Kembali ke Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>&copy; 2025 LapakBenz. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

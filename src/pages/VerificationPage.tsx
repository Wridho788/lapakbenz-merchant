import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRequestOtp, useVerifyOtp } from '../hooks/useAuth';

export const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();

  // Get phone and userId from location state
  const phone = location.state?.phone || '';
  const userId = location.state?.userId || '';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no phone number
  useEffect(() => {
    if (!phone || !userId) {
      navigate('/register', { replace: true });
      return;
    }

    // Request OTP on mount
    requestOtpMutation.mutate({ username: phone });
  }, [phone, userId, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await requestOtpMutation.mutateAsync({ username: phone });
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      toast.error('Mohon masukkan 4 digit kode OTP lengkap');
      return;
    }

    try {
      const result = await verifyOtpMutation.mutateAsync({
        userid: userId,
        otp: otpValue,
      });

      if (result.success || result.content?.status === 1 || result.content?.verified === 1 || String(result.content?.verified) === '1') {
        // Check if account status is active
        if (result.content?.status === 0 || String(result.content?.status) === '0') {
          // Account verified but not active yet
          toast.success(
            'Akun Anda telah berhasil diverifikasi! Mohon menunggu persetujuan admin untuk mengaktifkan akun Anda.',
            { duration: 6000 }
          );
        } else {
          // Account verified and active
          toast.success('Verifikasi berhasil! Silakan login dengan kredensial Anda.');
        }
        
        // Navigate to login after a short delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      }
    } catch (error: any) {
      console.error('Verification failed:', error);
      toast.error(error?.message || 'Verifikasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-accent/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-xl mb-4 shadow-accent p-3">
            <img src="/lapakbenz.png" alt="LapakBenz Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Verifikasi Akun Anda</h1>
          <p className="text-gray-600 mt-2">
            Kami telah mengirimkan kode verifikasi 4 digit ke
          </p>
          <p className="text-accent font-semibold mt-1">{phone}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Success Alert for OTP Sent */}
          {requestOtpMutation.isSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-green-800">
                Kode OTP berhasil dikirim!
              </p>
            </div>
          )}

          {/* Error Alert */}
          {(requestOtpMutation.isError || verifyOtpMutation.isError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-800">
                {requestOtpMutation.error?.message || verifyOtpMutation.error?.message || 'Terjadi kesalahan'}
              </p>
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Masukkan Kode Verifikasi
            </label>
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  disabled={verifyOtpMutation.isPending}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={verifyOtpMutation.isPending || otp.join('').length !== 4}
            className="w-full bg-accent text-white py-3.5 px-4 rounded-lg hover:bg-accent-hover focus:ring-4 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-accent mb-4"
          >
            {verifyOtpMutation.isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memverifikasi...
              </span>
            ) : (
              'Verifikasi Akun'
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={requestOtpMutation.isPending}
                className="text-accent hover:text-accent-hover font-medium transition-colors disabled:opacity-50"
              >
                {requestOtpMutation.isPending ? 'Mengirim...' : 'Kirim Ulang Kode'}
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                Kirim ulang kode dalam <span className="font-semibold text-accent">{countdown}d</span>
              </p>
            )}
          </div>

          {/* Back to Register */}
          <div className="mt-6 text-center pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/register', { replace: true })}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Kembali ke Pendaftaran
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

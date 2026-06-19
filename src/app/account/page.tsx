"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import { authApi, adminApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountDashboard from "@/components/account/AccountDashboard";

type Step = "auth" | "register-info" | "register-address" | "otp" | "logged-in";

export default function AccountPage() {
  const { user, isLoggedIn, login, register, verifyOtp, logout } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>(isLoggedIn ? "logged-in" : "auth");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country] = useState("India");
  const [pincode, setPincode] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Sync step with login state
  useEffect(() => {
    if (isLoggedIn) {
      if (step !== "logged-in") setStep("logged-in");
    } else {
      if (step === "logged-in") setStep("auth");
    }
  }, [isLoggedIn, step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      // Check if it looks like an admin username (no @ symbol, not just a 10 digit phone number)
      if (!email.includes("@") && !/^\d{10}$/.test(email)) {
        try {
          const data = await adminApi.login(email, password);
          if (data.token) {
            localStorage.setItem("admin_token", data.token);
            setSuccess("Admin login successful! Redirecting to dashboard...");
            setTimeout(() => router.push("/admin/"), 1000);
            return;
          }
        } catch (adminErr: any) {
          throw new Error(adminErr.message || "Admin login failed");
        }
      }

      // Default user login
      const result = await login(email, password);
      if (result.requiresVerification) {
        setStep("otp"); setSuccess("OTP sent to your email for verification.");
      } else {
        setSuccess("Login successful!");
        setTimeout(() => router.push("/"), 1000);
      }
    } catch (err: any) {
      if (err.message && err.message.includes("not verified")) {
        setStep("otp");
        setSuccess(err.message);
      } else {
        setError(err.message || "Login failed");
      }
    } finally { setLoading(false); }
  };

  const handleRegisterStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setStep("register-address");
  };

  const handleRegisterStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register({
        firstName, lastName, email, phone, altPhone, password,
        addressLine1, addressLine2, city, state, country, pincode,
      });
      setStep("otp"); setSuccess("Registration successful! Check your email for OTP.");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) { setError("Please enter the complete 6-digit OTP"); return; }
    setError(""); setLoading(true);
    try {
      await verifyOtp(email, otpString);
      setSuccess("Email verified successfully!");
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 pl-11 bg-ivory/50 border border-plum/10 rounded-xl text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-rose-gold/30 focus:border-rose-gold/50 transition-all text-sm";
  const labelClass = "block text-xs font-medium text-plum/60 mb-1.5 ml-1";

  if (step === "logged-in" && isLoggedIn) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
          <div className="container-premium max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
              <AccountSidebar />
              <AccountDashboard />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory pt-28 pb-20">
        <div className="container-premium max-w-md mx-auto px-4">
          <AnimatePresence mode="wait">
            {/* LOGIN / REGISTER STEP 1 */}
            {step === "auth" && (
              <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-glass p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-plum">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h1>
                  <p className="text-plum/50 text-sm mt-1">
                    {isLogin ? "Sign in to your Solanki Vastra Bhandar account" : "Join us for exclusive collections"}
                  </p>
                </div>

                {/* Tab Toggle */}
                <div className="flex bg-ivory/60 rounded-xl p-1 mb-6">
                  <button onClick={() => { setIsLogin(true); setError(""); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${isLogin ? "bg-white text-plum shadow-sm" : "text-plum/40 hover:text-plum/60"}`}>
                    Login
                  </button>
                  <button onClick={() => { setIsLogin(false); setError(""); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${!isLogin ? "bg-white text-plum shadow-sm" : "text-plum/40 hover:text-plum/60"}`}>
                    Register
                  </button>
                </div>

                {error && <div className="bg-red-50 text-red-600 text-xs px-4 py-2.5 rounded-lg mb-4">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 text-xs px-4 py-2.5 rounded-lg mb-4">{success}</div>}

                {isLogin ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className={labelClass}>Email / Phone / Username</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email, Phone or Admin Username" className={inputClass} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-plum/30 hover:text-plum/50">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-plum to-plum/80 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {loading ? "Signing in..." : "Sign In"} {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterStep1} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>First Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputClass} required />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputClass} required />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputClass} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Alternate Phone <span className="text-plum/30">(Optional)</span></label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                        <input type="tel" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} placeholder="+91 98765 43210" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Create Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className={inputClass} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-plum/30 hover:text-plum/50">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                        <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className={inputClass} required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-plum/30 hover:text-plum/50">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-plum to-plum/80 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      Next: Address Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* REGISTER STEP 2 — ADDRESS */}
            {step === "register-address" && (
              <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-glass p-6 sm:p-8">
                <button onClick={() => setStep("auth")} className="flex items-center gap-1 text-plum/50 hover:text-plum text-sm mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl font-bold text-plum">Shipping Address</h2>
                  <p className="text-plum/50 text-sm mt-1">Where should we deliver your orders?</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 text-xs px-4 py-2.5 rounded-lg mb-4">{error}</div>}

                <form onSubmit={handleRegisterStep2} className="space-y-3">
                  <div>
                    <label className={labelClass}>Address Line 1</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                      <input type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="House no., Street, Locality" className={inputClass} required />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Address Line 2 <span className="text-plum/30">(Optional)</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                      <input type="text" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Landmark, Area" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>City</label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-rose-gold/30 text-sm" required />
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-rose-gold/30 text-sm" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Country</label>
                      <input type="text" value={country} disabled className="w-full px-4 py-3 bg-ivory/30 border border-plum/10 rounded-xl text-plum/50 text-sm cursor-not-allowed" />
                    </div>
                    <div>
                      <label className={labelClass}>Pincode</label>
                      <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="400001" className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-rose-gold/30 text-sm" required />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-rose-gold to-rose-gold/80 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                    {loading ? "Creating Account..." : "Create Account & Verify Email"} {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              </motion.div>
            )}

            {/* OTP VERIFICATION */}
            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-glass p-6 sm:p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-gold/10 to-lavender/10 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-rose-gold" />
                </div>
                <h2 className="font-display text-2xl font-bold text-plum mb-1">Verify Your Email</h2>
                <p className="text-plum/50 text-sm mb-6">
                  We&apos;ve sent a 6-digit code to <span className="font-medium text-plum">{email}</span>
                </p>

                {error && <div className="bg-red-50 text-red-600 text-xs px-4 py-2.5 rounded-lg mb-4">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 text-xs px-4 py-2.5 rounded-lg mb-4">{success}</div>}

                <form onSubmit={handleVerifyOtp}>
                  <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-ivory/50 border-2 border-plum/10 rounded-xl text-plum focus:outline-none focus:ring-2 focus:ring-rose-gold/40 focus:border-rose-gold transition-all"
                      />
                    ))}
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-plum to-plum/80 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? "Verifying..." : "Verify Email"} {!loading && <CheckCircle className="w-4 h-4" />}
                  </button>
                </form>
                <button onClick={() => { authApi.resendOtp(email); setSuccess("New OTP sent!"); }} className="mt-3 text-sm text-plum/50 hover:text-rose-gold transition-colors">
                  Didn&apos;t receive? Resend OTP
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}



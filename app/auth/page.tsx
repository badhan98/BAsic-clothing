'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldAlert, ArrowRight, Check } from 'lucide-react';

export default function Auth() {
  const router = useRouter();
  const loginStore = useStore((state) => state.login);
  const user = useStore((state) => state.user);

  const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If already logged in, redirect to admin dashboard
  if (user) {
    router.push('/admin');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please fill in all credentials.');
        return;
      }
      // Mock login
      loginStore(email, 'Alexander', 'Mercer');
      setSuccess(true);
      setTimeout(() => router.push('/admin'), 1500);
    } else if (mode === 'register') {
      if (!email || !password || !firstName || !lastName) {
        setError('Please fill in all details.');
        return;
      }
      // Mock register
      loginStore(email, firstName, lastName);
      setSuccess(true);
      setTimeout(() => router.push('/admin'), 1500);
    } else if (mode === 'otp') {
      if (!email) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!otpSent) {
        setOtpSent(true);
        setError('');
      } else {
        if (otpCode !== '123456') {
          setError('Invalid OTP code. Enter 123456 to bypass.');
        } else {
          loginStore(email, 'OTP', 'User');
          setSuccess(true);
          setTimeout(() => router.push('/admin'), 1500);
        }
      }
    }
  };

  return (
    <div className="pt-28 pb-32 bg-[#050505] min-h-screen text-white flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        
        {/* Container box */}
        <div className="bg-[#0b0b0b] border border-white/5 p-8 space-y-8 shadow-2xl relative overflow-hidden">
          
          {/* Top Line decoration */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/10 via-white/50 to-white/10" />

          {/* Form Header */}
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 block">BASIC IDENTITY</span>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
              {mode === 'login' ? 'LOGIN SESSION' : mode === 'register' ? 'CREATE PROFILE' : 'ONE-TIME ACCESS'}
            </h2>
          </div>

          {success ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center animate-fade-in">
              <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest">ACCESS GRANTED</h4>
                <p className="text-xs text-white/45 mt-1 font-light uppercase tracking-wider">Establishing secure user profile session...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-light">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 flex items-center space-x-2 rounded-sm font-normal">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Names for Register Mode */}
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-white/50 block">First Name</label>
                    <input
                      type="text"
                      placeholder="FIRST NAME"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 px-3 py-2.5 text-white uppercase focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-white/50 block">Last Name</label>
                    <input
                      type="text"
                      placeholder="LAST NAME"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 px-3 py-2.5 text-white uppercase focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-white/50 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={mode === 'otp' && otpSent}
                    className="w-full bg-black/40 border border-white/10 pl-10 pr-3 py-2.5 text-white uppercase focus:outline-none focus:border-white transition-colors disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Password Input (Login/Register Mode) */}
              {mode !== 'otp' && (
                <div className="space-y-1.5">
                  <label className="text-white/50 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              {/* OTP Code Input */}
              {mode === 'otp' && otpSent && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-white/50 block">Enter One-Time Password</label>
                  <input
                    type="text"
                    placeholder="6-DIGIT OTP CODE (e.g. 123456)"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    className="w-full bg-black/40 border border-white/10 px-3 py-2.5 text-center text-white text-lg tracking-[0.4em] focus:outline-none focus:border-white transition-colors"
                    required
                  />
                  <span className="text-[10px] text-white/30 block text-center">We sent a mock OTP code to your email. Enter 123456 to verify.</span>
                </div>
              )}

              {/* Submit Trigger */}
              <button
                type="submit"
                className="w-full bg-white text-black py-3.5 uppercase font-medium tracking-widest hover:bg-white/90 transition-all flex items-center justify-center space-x-2 cursor-none"
              >
                <span>{mode === 'otp' && !otpSent ? 'Send OTP Code' : 'Authorize Credentials'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Form Toggles */}
              <div className="pt-4 border-t border-white/5 flex flex-col items-center space-y-2 text-[10px] uppercase tracking-widest text-white/40">
                {mode === 'login' && (
                  <>
                    <button type="button" onClick={() => setMode('register')} className="hover:text-white transition-colors cursor-none">
                      Create New Account
                    </button>
                    <button type="button" onClick={() => { setMode('otp'); setOtpSent(false); }} className="hover:text-white transition-colors cursor-none">
                      Login using OTP Code
                    </button>
                  </>
                )}

                {mode === 'register' && (
                  <>
                    <button type="button" onClick={() => setMode('login')} className="hover:text-white transition-colors cursor-none">
                      Already have an account? Login
                    </button>
                    <button type="button" onClick={() => { setMode('otp'); setOtpSent(false); }} className="hover:text-white transition-colors cursor-none">
                      Login using OTP Code
                    </button>
                  </>
                )}

                {mode === 'otp' && (
                  <>
                    <button type="button" onClick={() => setMode('login')} className="hover:text-white transition-colors cursor-none">
                      Back to Standard Login
                    </button>
                    {otpSent && (
                      <button type="button" onClick={() => setOtpSent(false)} className="hover:text-white transition-colors cursor-none text-white/30">
                        Resend Code
                      </button>
                    )}
                  </>
                )}
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

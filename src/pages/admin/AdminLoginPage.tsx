import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Key } from 'lucide-react';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onNavigateHome }) => {
  const { login } = useAuth();
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      showToast('Welcome to BestWeGive Administration', 'success');
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
      showToast(err.message || 'Authentication error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@bestwegiveagency.com');
    setPassword('BestWeGive2026!');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative py-12">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F4C542]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Back to Site Button */}
      <div className="absolute top-8 left-8">
        <button
          onClick={onNavigateHome}
          className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
        >
          ← Return to Website
        </button>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <Logo variant="white-gold" size="lg" showTagline={true} className="justify-center" />
          <h2 className="text-2xl font-black tracking-tight text-white pt-4">
            BestWeGive Agency Admin
          </h2>
          <p className="text-xs text-neutral-400">
            Sign in to access the agency administration dashboard and management suite.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="bg-[#0B0B0B] border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@bestwegiveagency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-neutral-700 focus:border-[#F4C542] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-neutral-900 border-neutral-700 text-[#F4C542] focus:ring-0"
                />
                <span>Remember session</span>
              </label>
              <span className="text-neutral-500 text-[11px]">Protected Portal</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-black bg-[#F4C542] hover:bg-[#FFF3C4] shadow-lg shadow-[#F4C542]/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Initial Credential Helper */}
          <div className="pt-4 border-t border-neutral-800 text-center space-y-2">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[11px] text-neutral-400 hover:text-[#F4C542] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Key className="w-3 h-3 text-[#F4C542]" />
              <span>Use Initial Super Admin Credentials</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F4C542]" />
          <span>Bcrypt Password Hashing & JWT Authorization</span>
        </div>
      </div>
    </div>
  );
};

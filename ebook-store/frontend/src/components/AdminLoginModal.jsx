import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  Lock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { apiAdminLogin } from '../services/api';

export default function AdminLoginModal({ 
  isOpen, 
  onClose, 
  onAdminLoginSuccess 
}) {
  const [adminKey, setAdminKey] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (adminKey.trim() !== 'admin123' && adminKey.trim() !== 'admin') {
      setError('Invalid admin key. (Hint: use "admin123" or click the 1-click button)');
      return;
    }

    setLoading(true);

    try {
      await apiAdminLogin(adminKey);
    } catch (err) {
      console.warn('Backend admin login attempt notice:', err.message);
    }

    setTimeout(() => {
      setLoading(false);
      onAdminLoginSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-sm bg-[#1E1B19] rounded-3xl shadow-2xl border border-[#3E3430] overflow-hidden my-auto text-white animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#292320] p-6 border-b border-[#3E3430] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#3D332F] text-[#D8B4A4]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne text-lg font-bold text-white">
                Admin Console Auth
              </h3>
              <p className="text-[11px] text-[#A69488] font-sans">
                Price controls, coupons, and orders ledger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleAdminAuth} className="space-y-4 font-sans text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase font-bold text-[#A69488] mb-1.5">
                Admin Security Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#453A35] bg-[#141211] text-white focus:outline-none focus:ring-1 focus:ring-[#D8B4A4] font-mono text-xs"
                />
              </div>
              <p className="text-[10px] text-[#78665C] mt-1 font-sans">
                Default key: <span className="font-mono text-[#D8B4A4]">admin123</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#E5D2C5] hover:bg-[#F3E3DA] text-[#241E1C] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Verifying Access...' : 'Authenticate & Open Admin Page'}</span>
            </button>

            {/* 1-Click Demo Shortcut */}
            <button
              type="button"
              onClick={() => {
                setAdminKey('admin123');
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  onAdminLoginSuccess();
                  onClose();
                }, 400);
              }}
              className="w-full py-2.5 rounded-xl bg-[#2C2421] hover:bg-[#382E2A] text-[#D8B4A4] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>⚡ 1-Click Direct Admin Access</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

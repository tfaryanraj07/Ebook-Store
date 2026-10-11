import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Lock, 
  AlertCircle
} from 'lucide-react';
import { apiAdminLogin } from '../services/api';

export default function AdminLoginModal({ 
  isOpen, 
  onClose, 
  onAdminLoginSuccess 
}) {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPasscode = adminPasscode.trim();

    if (!cleanEmail || !cleanPasscode) {
      setError('Please enter both admin email and security passcode.');
      return;
    }

    setLoading(true);

    try {
      await apiAdminLogin(cleanEmail, cleanPasscode);
      setLoading(false);
      onAdminLoginSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err?.message || 'Invalid admin credentials. Access denied.');
    }
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
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter admin email address"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#453A35] bg-[#141211] text-white focus:outline-none focus:ring-1 focus:ring-[#D8B4A4] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-[#A69488] mb-1.5">
                Admin Security Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#8C7A70] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter security passcode"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#453A35] bg-[#141211] text-white focus:outline-none focus:ring-1 focus:ring-[#D8B4A4] font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-full bg-[#E5D2C5] hover:bg-[#F3E3DA] text-[#241E1C] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Verifying Access...' : 'Authenticate & Open Admin Page'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

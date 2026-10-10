import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { apiLoginUser, apiRegisterUser } from '../services/api';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialMode = 'signin' 
}) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSuccess(false);
      setError('');
      setLoading(false);
      setPassword('');
    }
  }, [isOpen, initialMode]);

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please provide your name.');
      return;
    }

    setLoading(true);

    try {
      let loggedUser = null;
      if (mode === 'signup') {
        loggedUser = await apiRegisterUser(name, email, password);
      } else {
        loggedUser = await apiLoginUser(email, password);
      }

      if (!loggedUser) {
        throw new Error('Authentication failed. Please check your credentials.');
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onLoginSuccess(loggedUser, mode === 'signup');
        handleClose();
      }, 700);
    } catch (err) {
      console.warn('Auth verification failed:', err.message);
      setLoading(false);
      setSuccess(false);
      setError(err.message || 'Wrong email or password. Only registered users can sign in.');
    }
  };

  return (
    <div 
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E7DFD5] overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        
        {/* Header Ribbon */}
        <div className="bg-[#FAF5F0] p-6 border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EFE3D8] text-[#8E6E60]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne text-xl font-bold text-[#241E1C]">
                {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
              </h3>
              <p className="text-xs text-[#7D6B62] font-sans">
                {mode === 'signin' 
                  ? 'Sign in to access your digital library & purchases' 
                  : 'Join 12,400+ intentional individuals today'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-[#EFE4DA] text-[#63534B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EADBCE] bg-[#FAF7F2]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-[#241E1C] border-b-2 border-[#241E1C]'
                : 'text-[#8C7A70] hover:text-[#241E1C]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-[#241E1C] border-b-2 border-[#241E1C]'
                : 'text-[#8C7A70] hover:text-[#241E1C]'
            }`}
          >
            Sign Up (New User)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-syne text-lg font-bold text-[#241E1C]">
                {mode === 'signin' ? 'Signed in successfully!' : 'Account created!'}
              </h4>
              <p className="text-xs text-[#6F5D54]">Redirecting to your personalized storefront...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {error}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#7A6960] mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9F8E84] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Raj Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5C2B4] focus:outline-none focus:ring-1 focus:ring-[#8E6E60] bg-white text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#7A6960] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9F8E84] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5C2B4] focus:outline-none focus:ring-1 focus:ring-[#8E6E60] bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#7A6960] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9F8E84] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5C2B4] focus:outline-none focus:ring-1 focus:ring-[#8E6E60] bg-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#241E1C] hover:bg-[#3D332F] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-all cursor-pointer mt-2"
              >
                <span>{mode === 'signin' ? 'Sign In with Email' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo 1-Click Login */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('customer@hengyi.studio');
                    setName('Raj');
                    setPassword('password123');
                  }}
                  className="text-[11px] text-[#8E6E60] hover:underline cursor-pointer"
                >
                  ⚡ Fill demo credentials (customer@hengyi.studio)
                </button>
              </div>

              <div className="pt-3 border-t border-[#EFE5DB] text-center text-[11px] text-[#8C7A70] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8E6E60]" />
                <span>Encrypted credentials & secure JWT sessions</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Crown, ArrowRight, Check } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-[#3B0E1B] border border-[#F2D6D6]/30 rounded-2xl shadow-2xl p-8 z-10 text-[#E8CFCF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#E8CFCF]/60 hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#7A4A55] flex items-center justify-center text-[#F2D6D6] mb-3">
            <Crown className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-[#F2D6D6] tracking-wide">
            RM VIP Atelier
          </h3>
          <p className="text-xs text-[#E8CFCF]/75 mt-1 tracking-wider">
            Sign in to access private salon previews and reserved archival pieces.
          </p>
        </div>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-[#7A4A55] flex items-center justify-center text-[#F2D6D6] mx-auto mb-3">
              <Check className="w-5 h-5" />
            </div>
            <p className="font-serif text-lg text-[#F2D6D6]">Welcome Back, Collector</p>
            <p className="text-xs text-[#E8CFCF]/70 mt-1">Accessing private vault...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#E8CFCF]/70 mb-1.5">
                Client Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@glow.com"
                className="w-full bg-black/30 border border-white/15 focus:border-[#F2D6D6] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F2D6D6] placeholder-[#E8CFCF]/30 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#E8CFCF]/70 mb-1.5">
                Private Passcode
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full bg-black/30 border border-white/15 focus:border-[#F2D6D6] rounded-[4px] px-3.5 py-2.5 text-xs text-[#F2D6D6] placeholder-[#E8CFCF]/30 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#7A4A55] hover:bg-[#8D5764] text-[#F2D6D6] text-xs uppercase tracking-[0.2em] font-medium transition-all rounded-[4px] flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
            >
              <span>Access Private Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2">
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Atelier concierge invitation sent.');
                }}
                className="text-[11px] text-[#E8CFCF]/60 hover:text-[#FFF5F5] underline underline-offset-4 decoration-white/20 transition-colors"
              >
                Request Atelier Collector Invitation
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

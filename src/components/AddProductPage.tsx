import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Lock, LogOut } from 'lucide-react';

const AIRTABLE_FORM_URL =
  'https://airtable.com/embed/appCxDAZHPIW8aJfG/pagiAFuhk6Pf9vYpw/form';
const TOKEN_KEY = 'rm_add_product_token';

export const AddProductPage: React.FC = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsChecking(false);
      return;
    }
    let cancelled = false;
    fetch(`/api/verify-password?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as { ok?: boolean };
        if (cancelled) return;
        if (response.ok && data.ok) {
          setIsAuthed(true);
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      })
      .catch(() => {
        if (!cancelled) sessionStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; token?: string; error?: string };
      if (response.ok && data.ok && data.token) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        setIsAuthed(true);
        setPassword('');
      } else {
        setError(data.error || 'Kata laluan salah.');
      }
    } catch {
      setError('Ralat rangkaian. Sila cuba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setIsAuthed(false);
    setPassword('');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#2A0A14] text-[#E8CFCF] flex flex-col items-center px-4 py-6 sm:py-10">
      <header className="w-full max-w-3xl flex items-center justify-between mb-6">
        <a href="/" className="inline-flex items-center select-none hover:opacity-80 transition-opacity">
          <img src="/image/RM-Logo-White.png" alt="RM Logo" className="h-7 md:h-9 w-auto object-contain" />
        </a>
        <a
          href="/"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#E8CFCF]/70 hover:text-[#F2D6D6] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to catalog
        </a>
      </header>

      {isChecking ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#E8CFCF]/70">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-xs uppercase tracking-[0.25em]">Checking access…</span>
        </div>
      ) : !isAuthed ? (
        <div className="flex-1 w-full flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-[#45101F] border border-[#F2D6D6]/15 rounded-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.55)] p-7 sm:p-9"
          >
            <div className="w-12 h-12 rounded-full bg-[#350816] border border-[#F2D6D6]/20 flex items-center justify-center mb-5">
              <Lock className="w-5 h-5 text-[#F2D6D6]" />
            </div>
            <h1 className="font-serif text-3xl font-thin text-[#F2D6D6]">Protected page</h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#E8CFCF]/60 mt-1.5">
              Enter the password to add a product
            </p>

            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#E8CFCF]/70 mt-6 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
              autoComplete="current-password"
              className="w-full bg-black/30 border border-[#F2D6D6]/25 rounded-[8px] px-4 py-3 text-sm text-[#F2D6D6] placeholder-[#E8CFCF]/40 focus:outline-none focus:border-[#F2D6D6]/60 transition-colors"
              placeholder="••••••••"
            />

            {error && <p className="text-xs text-red-300 mt-3">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || password.length === 0}
              className="mt-6 w-full py-3 bg-[#7A4A55] hover:bg-[#8D5764] disabled:opacity-50 disabled:cursor-not-allowed text-[#F2D6D6] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Unlock
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col">
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-thin text-[#F2D6D6]">
              Add New Product
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#E8CFCF]/60 mt-1">
              Submit a new piece to the RM Atelier catalog
            </p>
          </div>

          <div className="w-full rounded-[16px] md:rounded-[20px] border border-[#F2D6D6]/15 overflow-hidden bg-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <iframe
              className="airtable-embed w-full block"
              src={AIRTABLE_FORM_URL}
              title="Add new product"
              width="100%"
              height={720}
              style={{ background: 'transparent', border: 0 }}
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[6px] border border-[#F2D6D6]/40 hover:border-[#F2D6D6]/80 text-[#F2D6D6] text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Lock page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

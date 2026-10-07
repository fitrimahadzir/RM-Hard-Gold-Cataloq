import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

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

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.metal.toLowerCase().includes(query.toLowerCase()) ||
          p.gemstone.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-[#3B0E1B] border border-[#F2D6D6]/30 rounded-2xl shadow-2xl p-6 z-10 text-[#E8CFCF]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <Search className="w-5 h-5 text-[#F2D6D6]/70" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search item name..."
            className="w-full bg-transparent text-[#F2D6D6] placeholder-[#E8CFCF]/40 text-sm md:text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-[#E8CFCF]/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions / Results */}
        <div className="mt-4 max-h-80 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="py-6 text-center text-xs text-[#E8CFCF]/60">
              <p className="mb-3 uppercase tracking-widest text-[#F2D6D6]/50">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['ring', 'bead', 'pendant', 'earring', 'flower', 'necklace'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 rounded-full border border-white/10 hover:border-[#F2D6D6]/40 text-xs text-[#E8CFCF] hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#E8CFCF]/60">
              No pieces found matching "{query}".
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProduct(item);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 ring-card-shape bg-[#7A4A55] p-1 flex items-center justify-center shrink-0">
                      <img src={item.image} alt={item.fullName} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm md:text-base text-[#F2D6D6] group-hover:text-white">
                        {item.fullName}
                      </h4>
                      <p className="text-[11px] text-[#E8CFCF]/70">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#F2D6D6] font-medium tabular-nums">
                      {item.weight}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#F2D6D6]/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

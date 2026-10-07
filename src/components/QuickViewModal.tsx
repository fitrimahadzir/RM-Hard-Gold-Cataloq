import React, { useState, useEffect } from 'react';
import { X, Shield, MessageCircle, Heart, Scale, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { waLink } from '../config';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Initialize selected size whenever product changes
  useEffect(() => {
    if (product && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-3xl bg-[#3B0E1B] border border-[#F2D6D6]/20 rounded-[24px] shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 text-[#E8CFCF]"
        role="dialog"
        aria-modal="true"
        aria-label={product.fullName}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#E8CFCF]/70 hover:text-white rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Rounded Rectangle Product Showcase */}
        <div className="p-8 bg-[#300A15] flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[280px] aspect-square p-2">
            {/* Outlined frame accent */}
            <div
              className="absolute inset-2 ring-outline-shape border-[1.5px] border-[#F2D6D6]/70 translate-x-2 -translate-y-2 pointer-events-none"
              aria-hidden="true"
            />
            {/* Rounded Rectangle Container */}
            <div className="w-full h-full ring-card-shape bg-[#7A4A55] p-6 flex items-center justify-center overflow-hidden shadow-xl">
              <img
                src={product.image}
                alt={product.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-[11px] uppercase tracking-[0.25em] text-[#F2D6D6]/60">
            <span>RM Atelier</span>
            <span>·</span>
            <span>Ref: {product.id.toUpperCase()}</span>
          </div>
        </div>

        {/* Right: Name, Short Desc, Size Options, Weight & Booking Button */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Metal & Wishlist tag */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-[#E8CFCF]/70 font-medium">
                {product.metal} · {product.karat}
              </span>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-1.5 transition-colors ${
                  isWishlisted ? 'text-red-400' : 'text-[#E8CFCF]/50 hover:text-[#FFF5F5]'
                }`}
                aria-label="Add to client selection"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* 1. NAMA */}
            <h2 className="font-serif text-2xl md:text-3xl text-[#F2D6D6] tracking-wide mt-1.5 font-normal">
              {product.fullName}
            </h2>

            {/* Pricing based on current market gold rate (Live spot gold rate) */}
            <div className="mt-1 text-[11px] text-[#F2D6D6]/60 tracking-wider uppercase">
              Priced by current market gold rate and craftsmanship
            </div>

            {/* 2. SHORT DESC */}
            <p className="text-xs text-[#E8CFCF]/90 leading-relaxed mt-2.5">
              {product.shortDesc}
            </p>

            {/* 3. BERAT (Weight Box) */}
            <div className="my-4 p-3 rounded-xl bg-black/25 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-[#E8CFCF]/80">
                <Scale className="w-4 h-4 text-[#F2D6D6]" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#E8CFCF]/60">
                    Estimated Gold Weight
                  </span>
                  <span className="font-medium text-[#F2D6D6]">
                    {product.weight} (±0.05g)
                  </span>
                </div>
              </div>
              <div className="text-right text-[11px] text-[#E8CFCF]/60">
                <span>916 Gold (22K)</span>
              </div>
            </div>

            {/* 4. PILIHAN SAIZ (Category Specific) */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#F2D6D6] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 opacity-70" />
                  <span>{product.sizeLabel}</span>
                </span>
                <span className="text-[11px] text-[#E8CFCF]/60">
                  Select sample size
                </span>
              </div>

              {/* Sizes Grid/Row */}
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#F2D6D6] text-[#2A0A14] font-semibold shadow-md'
                        : 'border border-white/15 hover:border-white/40 text-[#E8CFCF] hover:bg-white/5'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. BAWAH SEKALI BUTANG TEMPAHAN */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
            <a
              href={waLink(
                `Hello RM Atelier, I would like to inquire about ${product.fullName} (Ref: ${product.id.toUpperCase()}).`
              )}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-[#7A4A55] hover:bg-[#8D5764] active:scale-[0.99] text-[#F2D6D6] hover:text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all rounded-[6px] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Inquire on WhatsApp</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#E8CFCF]/60">
              <Shield className="w-3.5 h-3.5 text-[#F2D6D6]/70" />
              <span>Reservations for private viewing and special orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

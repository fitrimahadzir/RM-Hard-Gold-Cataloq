import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES } from '../data/products';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  isPriorityHovered?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  isPriorityHovered = false,
}) => {
  const [isHovered, setIsHovered] = useState(isPriorityHovered);
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="group relative flex flex-col items-center cursor-pointer select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onQuickView(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onQuickView(product);
        }
      }}
      aria-label={`${product.fullName}, ${product.weight}`}
    >
      {/* 
        Image Container Wrapper:
        Contains the offset outline on hover, and the rounded rectangle dusty-rose box
      */}
      <div className="relative w-full aspect-square flex items-center justify-center p-2">
        {/*
          HOVER STATE OFFSET OUTLINED FRAME:
          1.5px blush-pink border, rounded rectangle shape.
          Appears slightly shifted up-right behind/over the image (translate-x-2 -translate-y-2).
          Smooth 300ms transition.
        */}
        <div
          className={`absolute inset-2 pointer-events-none ring-outline-shape border-[1.5px] border-[#F2D6D6]/85 transition-all duration-300 ease-out z-10 ${
            isHovered
              ? 'opacity-100 translate-x-2 -translate-y-2'
              : 'opacity-0 translate-x-0 translate-y-0 scale-[0.99]'
          }`}
          aria-hidden="true"
        />

        {/* 
          Main Shaped Image Container:
          Muted dusty-rose background (#7A4A55)
          Rounded rectangle shape (border-radius: 24px)
        */}
        <div
          className="relative w-full h-full ring-card-shape bg-[#7A4A55] overflow-hidden flex items-center justify-center transition-transform duration-300 ease-out shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        >
          {/* Subtle inner ambient glow */}
          <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none" />

          {/* Ring Image or Resilient Fallback */}
          {!imageError ? (
            <img
              src={product.image}
              alt={product.fullName}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="relative z-0 w-full h-full object-contain p-6 md:p-7 drop-shadow-[0_14px_22px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            /* Styled CSS/SVG Fallback Container */
            <div className="relative z-0 w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#F2D6D6]">
              <svg
                viewBox="0 0 100 100"
                className="w-24 h-24 stroke-[#F2D6D6] fill-none stroke-[1.5] drop-shadow-md"
              >
                <circle cx="50" cy="55" r="28" strokeDasharray="3 2" />
                <path d="M50 20 L58 32 L50 44 L42 32 Z" fill="#F2D6D6" fillOpacity="0.25" />
                <circle cx="50" cy="32" r="3" fill="#FFF" />
              </svg>
              <span className="font-serif text-xs tracking-wider opacity-80 mt-2">
                {product.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 
        Below Image Details:
        - Product name in serif, centered: Ring «Name»
        - Subtitle on hover (e.g. "White gold diamonds.")
        - Price in format "1400₴"
        - "Preview" button slides/fades in below price on hover for B2B preview
      */}
      <div className="w-full flex flex-col items-center text-center mt-3 px-2 min-h-[92px]">
        {/* Product Name */}
        <h3 className="font-serif text-lg md:text-xl text-[#F2D6D6] tracking-wide font-normal">
          {product.name}
        </h3>

        {/* 
          Hover Subtitle:
          A small subtitle appears under the name in tiny muted text with smooth 300ms transition.
        */}
        <div
          className={`transition-all duration-300 ease-out overflow-hidden ${
            isHovered
              ? 'opacity-100 max-h-6 translate-y-0 my-0.5'
              : 'opacity-0 max-h-0 -translate-y-1 my-0'
          }`}
        >
          <p className="text-[11px] md:text-[12px] text-[#E8CFCF]/75 font-serif italic tracking-wide">
            {product.subtitle}
          </p>
        </div>

        {/* Category (replaces weight) */}
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#E8CFCF]/60 mt-0.5">
          {CATEGORIES.find((c) => c.id === product.category)?.singular}
        </span>

        {/* 
          B2B "Preview" button:
          Dark burgundy, small rounded rectangle, blush text.
          Slides/fades in below the price on hover.
        */}
        <div
          className={`transition-all duration-300 ease-out mt-2 ${
            isHovered
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-[#350816] hover:bg-[#25040E] active:scale-95 text-[#F2D6D6] hover:text-[#FFF5F5] text-xs px-4 py-1.5 rounded-[4px] border border-[#F2D6D6]/20 hover:border-[#F2D6D6]/40 transition-all cursor-pointer shadow-md tracking-wider font-medium flex items-center gap-1.5"
            aria-label={`Preview ${product.fullName}`}
          >
            <Eye className="w-3 h-3 opacity-80" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
